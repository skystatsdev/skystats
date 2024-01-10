import fs from 'fs-extra';
import path from 'path';
import { getFolderPath, getCacheFolderPath, getCacheFilePath, hasPath, getPath, getId } from './helper.js';
import mm from 'micromatch';
import util from 'util';
import _ from 'lodash';
import sharp from 'sharp';
import canvasModule, { Canvas } from 'canvas';
const { createCanvas, loadImage } = canvasModule;
import { building } from '$app/environment';
import minecraftData from 'minecraft-data';
const mcData = minecraftData('1.8.9');
import UPNG from 'upng-js';
import RJSON from 'relaxed-json';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import apng2gif from 'apng2gif-bin';

import child_process from 'child_process';
import { getFileHash } from './hashes';
import type {
	CustomResourcesOutputPack,
	CustomResourcesResourcePack,
	CustomResourcesTextureModel,
	CustomResourcesTextureMetadata,
	CustomResourcesTextureAnimation,
	CustomResourcesOutputTexture,
	CustomResourcesDebugStats,
	ItemTexture,
	SkyBlockItem
} from '$types/hypixel.js';
const execFile = util.promisify(child_process.execFile);

const normalizedSize = 128;
const resourceCaching = true;

const folderPath = getFolderPath();
const resourcePackFolder = path.resolve(getFolderPath(), '..', '..', 'public', 'resourcepacks');

const cacheFolderPath = getCacheFolderPath();
const packHashCacheFile = getCacheFilePath(cacheFolderPath, 'json', 'pack_hashes', 'json');
const resourceCacheFile = getCacheFilePath(cacheFolderPath, 'json', 'custom_resources', 'json');

let resourcesReady = false;
const readyPromise = new Promise<void>((resolve) => {
	setInterval(() => {
		if (resourcesReady) {
			resolve();
		}
	}, 1000);
});

const removeFormatting = new RegExp('§[0-9a-z]{1}', 'g');

async function getFiles(dir: string, fileList: string[]) {
	const files = await fs.readdir(dir);

	fileList = fileList || [];

	for (const file of files) {
		const fileStat = await fs.stat(path.resolve(dir, file));

		if (fileStat.isDirectory()) {
			fileList = await getFiles(path.resolve(dir, file), fileList);
		} else {
			fileList.push(path.resolve(dir, file));
		}
	}

	return fileList;
}

function getFrame(src: Canvas, frame: number) {
	const dst = createCanvas(normalizedSize, normalizedSize);
	const ctx = dst.getContext('2d');

	ctx.drawImage(src, 0, frame * normalizedSize * -1);

	return dst;
}

let resourcePacks: CustomResourcesResourcePack[] = [];
let packConfigHashes: { [key: string]: string } = {};

const outputPacks: CustomResourcesOutputPack[] = [];

export async function init() {
	const timeNow = performance.now();
	console.log(`Custom Resources loading started.`);

	await loadPackConfigs();
	let resourcesUpToDate = false;

	try {
		packConfigHashes = {};
		packConfigHashes = JSON.parse(fs.readFileSync(packHashCacheFile, 'utf8'));

		if (Object.keys(packConfigHashes).length !== resourcePacks.length) {
			throw new Error('The amount of config hashes does not match the amount of packs');
		}

		resourcePacks.forEach((pack) => {
			if (packConfigHashes[pack.config.id] !== pack.config.hash) {
				throw new Error('Config hashes were not matching!');
			}
		});

		resourcesUpToDate = true;
	} catch (e) {
		packConfigHashes = {};
		resourcePacks.forEach((pack: CustomResourcesResourcePack) => {
			packConfigHashes[pack.config.id] = pack.config.hash;
		});

		fs.writeFileSync(packHashCacheFile, JSON.stringify(packConfigHashes));
	}

	try {
		if (!resourceCaching) {
			throw new Error('Resource caching has been disabled!');
		}

		if (resourcesUpToDate) {
			resourcePacks = JSON.parse(fs.readFileSync(resourceCacheFile, 'utf8'));
		} else {
			throw new Error('Resources need to be loaded!');
		}
	} catch (e) {
		await loadResourcePacks();

		fs.writeFileSync(resourceCacheFile, JSON.stringify(resourcePacks));
	}

	resourcePacks = resourcePacks.sort((a, b) => b.config.priority - a.config.priority);
	resourcePacks.forEach((pack) => {
		outputPacks.push(
			Object.assign(
				{
					base_path: '/' + path.relative(path.resolve(folderPath, '..', 'public'), pack.base_path)
				},
				pack.config
			)
		);
	});

	resourcesReady = true;

	console.log(`Custom Resources loading done in ${(performance.now() - timeNow).toFixed(2).toLocaleString()}ms.`);
}

async function loadPackConfigs() {
	for (const packOrFile of await fs.readdir(resourcePackFolder, { withFileTypes: true })) {
		if (!packOrFile.isDirectory()) {
			continue;
		}

		const pack = packOrFile.name;
		const basePath = path.resolve(resourcePackFolder, pack);

		try {
			const configPath = path.resolve(basePath, 'config.json');

			const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
			config.hash = await getFileHash(configPath);

			resourcePacks.push({
				base_path: basePath,
				config,
				textures: []
			});
		} catch (e) {
			console.log("Couldn't find config for resource pack", pack);
		}
	}
}

async function loadResourcePacks() {
	resourcePacks = resourcePacks.sort((a, b) => a.config.priority - b.config.priority);

	for (const pack of resourcePacks) {
		pack.files = await getFiles(path.resolve(pack.base_path, 'assets', 'minecraft', 'mcpatcher', 'cit'), []);
		pack.textures = [];

		for (const file of pack.files) {
			if (path.extname(file) != '.properties') {
				continue;
			}

			const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
			const properties: { [key: string]: string } = {};

			for (const line of lines) {
				// Skipping comments
				if (line.startsWith('#')) {
					continue;
				}

				const split = line.split('=');

				if (split.length < 2) {
					continue;
				}

				properties[split[0]] = split.slice(1).join('=');
			}

			// Empty properties, probably whole file contaiend only comments
			if (Object.keys(properties).length === 0) {
				continue;
			}

			// Ignoring when type is set and is not "item"
			if ('type' in properties && properties.type !== 'item') {
				continue;
			}

			const texture: Partial<ItemTexture> = {
				weight: pack.config.priority,
				animated: false,
				file: path.basename(file)
			};

			let textureFile =
				'texture' in properties
					? path.resolve(path.dirname(file), properties.texture)
					: path.resolve(path.dirname(file), path.basename(file, '.properties'));

			if ('texture.bow_standby' in properties) {
				textureFile = path.resolve(path.dirname(file), properties['texture.bow_standby']);
			}

			if ('model' in properties) {
				const modelFile = path.resolve(path.dirname(file), properties['model']);

				try {
					const model = RJSON.parse(await fs.readFile(modelFile, 'utf8')) as CustomResourcesTextureModel;

					if (model.parent == 'builtin/generated') {
						const layers = Object.keys(model.textures).sort((a, b) => Number(a) - Number(b));
						const topLayer = layers.pop();

						if (topLayer && topLayer.startsWith('layer')) {
							const layerPath = path.resolve(pack.base_path, 'assets', 'minecraft', model.textures[topLayer] + '.png');
							await fs.access(layerPath, fs.constants.F_OK);

							textureFile = layerPath;
						}
					}
				} catch (e) {
					//
				}
			}

			if (Object.keys(properties).filter((a) => a.includes('texture.leather_')).length == 2) {
				try {
					const leatherProperties: string[] = Object.keys(properties).filter((a) => a.includes('texture.leather_'));

					let leatherBase = properties[leatherProperties.find((a) => !a.includes('_overlay')) ?? 1];
					let leatherOverlay = properties[leatherProperties.find((a) => a.includes('_overlay')) ?? 1];

					if (!leatherBase.endsWith('.png')) {
						leatherBase += '.png';
					}

					if (!leatherOverlay.endsWith('.png')) {
						leatherOverlay += '.png';
					}

					const leather = {
						base: path.resolve(path.dirname(file), leatherBase),
						overlay: path.resolve(path.dirname(file), leatherOverlay)
					};

					for (const id in leather) {
						const part = id as 'base' | 'overlay';

						await fs.access(leather[part], fs.constants.F_OK);

						const leatherImage = sharp(leather[part]);
						const leatherMetadata = (await leatherImage.metadata()) as unknown as CustomResourcesTextureMetadata;

						if (leatherMetadata.width != normalizedSize) {
							await fs.writeFile(
								leather[part],
								await leatherImage
									.resize(normalizedSize, leatherMetadata.height * (normalizedSize / leatherMetadata.width), {
										kernel: sharp.kernel.nearest
									})
									.toBuffer()
							);
						}
					}

					texture.leather = leather;
				} catch (e) {
					//
				}
			} else if (
				Object.keys(properties).filter((a) => a.includes('texture.leather_') && a.includes('_overlay')).length == 1
			) {
				const leatherProperties = Object.keys(properties).find(
					(a) => a.includes('texture.leather_') && a.includes('_overlay')
				);

				textureFile = path.resolve(path.dirname(file), properties[leatherProperties as string]);
			}

			if (!textureFile.endsWith('.png')) {
				textureFile += '.png';
			}

			try {
				await fs.access(textureFile, fs.constants.F_OK);
			} catch (e) {
				continue;
			}

			texture.path = textureFile;

			const textureImage = sharp(textureFile);
			const textureMetadata = (await textureImage.metadata()) as unknown as CustomResourcesTextureMetadata;

			if (textureMetadata.width != normalizedSize) {
				await fs.writeFile(
					textureFile,
					await textureImage
						.resize(normalizedSize, textureMetadata.height * (normalizedSize / textureMetadata.width), {
							kernel: sharp.kernel.nearest
						})
						.toBuffer()
				);
			}

			if (UPNG.decode(await fs.readFile(textureFile)).frames.length > 0) {
				texture.animated = true;
			}

			for (const property in properties) {
				if (property == 'weight') {
					texture.weight ??= 0;
					texture.weight += parseInt(properties[property]);
				}

				if (property == 'items' || property == 'matchItems') {
					const item = mcData.itemsByName[properties[property].trim().replace('minecraft:', '')];

					if (item) {
						texture.id = item.id;
						texture.damage ??= 0;
					}
				}

				if (property == 'damage') {
					texture.damage = parseInt(properties[property]);
				}

				if (!property.startsWith('nbt.')) {
					continue;
				}

				const regexString = properties[property];
				let regex: RegExp;

				if (regexString.startsWith('ipattern:')) {
					regex = mm.makeRe(regexString.substring(9), { nocase: true });
				} else if (regexString.startsWith('pattern:')) {
					regex = mm.makeRe(regexString.substring(9));
				} else if (regexString.startsWith('iregex:')) {
					regex = new RegExp(regexString.substring(7), 'i');
				} else if (regexString.startsWith('regex:')) {
					regex = new RegExp(regexString.substring(6));
				} else {
					if (property == 'nbt.ExtraAttributes.id') {
						texture.skyblock_id = regexString;
					}

					regex = new RegExp(`^${_.escapeRegExp(regexString)}$`);
				}

				texture.match ??= [];
				texture.match.push({
					value: property.substring(4),
					regex: regex.toString()
				});
			}

			let mcMeta;

			try {
				mcMeta = await fs.readFile(textureFile + '.mcmeta', 'utf8');
			} catch (e) {
				// ...
			}

			let metaProperties = {};
			if (mcMeta) {
				try {
					metaProperties = RJSON.parse(mcMeta);
				} catch (e) {
					// ...
				}
			}

			if ('animation' in metaProperties && textureMetadata.width != textureMetadata.height) {
				const animation = metaProperties.animation as CustomResourcesTextureAnimation;
				if (animation.frames === undefined) {
					continue;
				}

				texture.animated = true;

				const canvas = createCanvas(normalizedSize, normalizedSize);
				const ctx = canvas.getContext('2d');

				const image = (await loadImage(textureFile)) as unknown as Canvas;

				const pngFrames = [];
				const pngDelays = [];

				let currentTime = 0;
				for (const [index, frame] of animation.frames.entries()) {
					if (typeof frame == 'number') {
						animation.frames[index] = {
							index: frame,
							time: animation.frametime
						};
					}

					animation.frames[index].time = (animation.frames[index].time / 20) * 1000;
					animation.frames[index].totalTime = currentTime;
					currentTime += animation.frames[index].time;
				}

				animation.frametime = (animation.frametime / 20) * 1000;

				if ('frames' in animation) {
					if (animation.interpolate) {
						let totalLength = 0;

						for (const frame of animation.frames) {
							totalLength += frame.time;
						}

						const frameTimeInterpolated = (2 / 20) * 1000;

						const frameCountInterpolated = totalLength / frameTimeInterpolated;

						for (let i = 0; i < frameCountInterpolated; i++) {
							let frameCur, frameNext;
							const currentTime = (i / frameCountInterpolated) * totalLength;

							for (const [index, frame] of animation.frames.entries()) {
								if (frame.totalTime && frame.totalTime + frame.time > currentTime) {
									frameCur = frame;

									if (index >= animation.frames.length - 1) {
										frameNext = animation.frames[0];
									} else {
										frameNext = animation.frames[index + 1];
									}

									break;
								}
							}

							const opacity = frameCur && frameCur.totalTime ? (currentTime - frameCur.totalTime) / frameCur.time : 1;

							ctx.clearRect(0, 0, canvas.width, canvas.height);

							ctx.globalCompositeOperation = 'source-over';

							ctx.globalAlpha = 1;
							ctx.drawImage(getFrame(image, frameCur ? frameCur.index : 0), 0, 0);

							ctx.globalCompositeOperation = 'source-atop';

							ctx.globalAlpha = opacity;
							ctx.drawImage(getFrame(image, frameNext ? frameNext.index : 0), 0, 0);

							const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer;

							pngFrames.push(imageData);
							pngDelays.push(frameTimeInterpolated);
						}
					} else {
						for (const frame of animation.frames) {
							ctx.clearRect(0, 0, canvas.width, canvas.height);
							ctx.drawImage(getFrame(image, frame.index), 0, 0);

							pngDelays.push(frame.time);

							const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer;

							pngFrames.push(imageData);
						}
					}
				}

				if (pngFrames.length > 0) {
					const apng = UPNG.encode(pngFrames, normalizedSize, normalizedSize, 0, pngDelays);

					await fs.writeFile(textureFile, Buffer.from(apng));

					try {
						if (fs.existsSync(textureFile.replace('.png', '.gif'))) {
							await execFile(apng2gif, [textureFile, '-o', textureFile.replace('.png', '.gif')]);
						} else {
							await execFile(apng2gif, [textureFile, '-o', textureFile]);
						}
					} catch (error) {
						console.log(error);
					}
				}
			}

			pack.textures.push(texture as ItemTexture);
		}
	}
}

export function getPacks() {
	return outputPacks;
}

export function getCompletePacks() {
	return resourcePacks;
}

const textureMap = new Map();
const allTextures = new Map();
const textureIdDamageMap = new Map();
const allTexturesIdDamage = new Map();
const timeoutId = setTimeout(async () => {
	if (!resourcesReady) {
		await readyPromise;
	}

	for (const pack of resourcePacks) {
		for (const texture of pack.textures) {
			if (texture.skyblock_id !== undefined) {
				const key = `${pack.config.id}:${texture.skyblock_id}`;
				const data = textureMap.get(key) ?? [];

				textureMap.set(key, [...data, texture]);
				allTextures.set(texture.skyblock_id, true);
				continue;
			}

			const itemId = texture.id;
			const damage = texture.damage ?? 0;
			if (itemId !== undefined && itemId !== 397) {
				const key = `${pack.config.id}:${itemId}:${damage}`;
				const data = textureIdDamageMap.get(key) ?? [];

				textureIdDamageMap.set(key, [...data, texture]);

				allTexturesIdDamage.set(`${itemId}:${damage}`, true);
			}
		}
	}

	for (const [key, value] of textureMap) {
		textureMap.set(
			key,
			value.sort((a: ItemTexture, b: ItemTexture) => b.weight - a.weight)
		);
	}

	for (const [key, value] of textureIdDamageMap) {
		textureIdDamageMap.set(
			key,
			value.sort((a: ItemTexture, b: ItemTexture) => b.weight - a.weight)
		);
	}

	clearTimeout(timeoutId);
}, 100);

/**
 * Processes all textures that could potentially be connected to an item, then throws the one with biggest priority
 * @param {object} item
 * @param {object} options
 * @param {boolean} [options.ignore_id]
 * @param {string[]} [options.pack_ids]
 * @param {boolean} [options.debug]
 * @returns {object} Item's texture
 */
export function getTexture(item: SkyBlockItem, { ignore_id = false, pack_ids = [], debug = false, hotm = false } = {}) {
	if (
		((allTextures.has(getId(item)) === false && allTexturesIdDamage.has(`${item.id}:${item.damage ?? 0}`) === false) ||
			getId(item) === '') &&
		hotm === false
	) {
		return null;
	}

	const timeStarted = Date.now();

	const debugStats: CustomResourcesDebugStats = {
		processed_packs: 0,
		processed_textures: 0,
		found_matches: 0,
		time_spent_ms: 0
	};

	let outputTexture: Partial<CustomResourcesOutputTexture> = { weight: -9999, file: '' };

	// pack_ids = pack_ids && typeof pack_ids === 'string' ? pack_ids.split(',') : [];

	let tempPacks: CustomResourcesResourcePack[] = resourcePacks;

	const packIdsArray: string[] = Array.isArray(pack_ids) ? pack_ids : [];
	const packIdsSet: Set<string> = new Set(packIdsArray);

	if (packIdsArray.length > 0) {
		tempPacks = tempPacks
			.filter((a: CustomResourcesResourcePack) => packIdsSet.has(a.config.id))
			.sort((a, b) => packIdsArray.indexOf(a.config.id) - packIdsArray.indexOf(b.config.id))
			.reverse();
	}

	for (const pack of tempPacks) {
		const cachedTexture = textureMap.get(`${pack.config.id}:${getId(item)}`);
		if (cachedTexture) {
			for (const texture of cachedTexture) {
				if (
					(outputTexture.weight && texture.weight < outputTexture.weight) ||
					(texture.weight == outputTexture.weight && outputTexture.file && texture.file < outputTexture.file)
				) {
					continue;
				}

				let matches = 0;
				let matchValues = [];
				for (const match of texture.match) {
					let { value, regex } = match;

					if (value.endsWith('.*')) {
						value = value.slice(0, -2);
					}

					if (hasPath(item, 'tag', ...value.split('.')) == false) {
						continue;
					}

					const pathResult = getPath(item, 'tag', ...value.split('.'));
					matchValues = Array.isArray(pathResult) ? pathResult : [pathResult];

					const slash = regex.lastIndexOf('/');
					regex = new RegExp(regex.slice(1, slash), regex.slice(slash + 1));

					if (matchValues.some((matchValue) => regex.test(matchValue.toString().replace(removeFormatting, '')))) {
						matches++;
					}
				}

				debugStats.found_matches += matches;
				debugStats.processed_textures++;

				if (matches == texture.match.length) {
					outputTexture = Object.assign({ pack: { base_path: pack.base_path, config: pack.config } }, texture);
				}
			}

			debugStats.found_matches++;
		}

		const cachedtextureIdDamageMap = textureIdDamageMap.get(`${pack.config.id}:${item.id}:${item.damage ?? 0}`);
		if (cachedtextureIdDamageMap && cachedTexture === undefined) {
			for (const texture of cachedtextureIdDamageMap) {
				if (
					(outputTexture.weight && texture.weight < outputTexture.weight) ||
					(texture.weight == outputTexture.weight && outputTexture.file && texture.file < outputTexture.file)
				) {
					continue;
				}

				if (!ignore_id && texture.id != item.id) {
					continue;
				}

				if (!ignore_id && 'damage' in texture && texture.damage != item.damage) {
					continue;
				}

				if (!ignore_id && texture.match === undefined && !('skyblock_id' in texture)) {
					continue;
				}

				let matches = 0;

				let matchValues = [];
				for (const match of texture.match) {
					let { value, regex } = match;

					if (value.endsWith('.*')) {
						value = value.slice(0, -2);
					}

					if (hasPath(item, 'tag', ...value.split('.')) == false) {
						continue;
					}

					const pathResult = getPath(item, 'tag', ...value.split('.'));
					matchValues = Array.isArray(pathResult) ? pathResult : [pathResult];

					const slash = regex.lastIndexOf('/');
					regex = new RegExp(regex.slice(1, slash), regex.slice(slash + 1));

					if (matchValues.some((matchValue) => regex.test(matchValue.toString().replace(removeFormatting, '')))) {
						matches++;
					}
				}

				debugStats.found_matches += matches;
				debugStats.processed_textures++;

				if (matches == texture.match.length) {
					outputTexture = Object.assign({ pack: { base_path: pack.base_path, config: pack.config } }, texture);
				}
			}

			debugStats.processed_packs++;
		}
	}

	if (!('path' in outputTexture)) {
		return null;
	}

	outputTexture.path = path.posix.relative(path.resolve(folderPath, '..', 'public'), outputTexture.path as string);
	debugStats.time_spent_ms = Date.now() - timeStarted;
	outputTexture.debug = debugStats;

	return outputTexture;
}

if (!building) {
	await init();
}
