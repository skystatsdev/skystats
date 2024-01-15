import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

await fs.ensureDir(getCacheFolderPath());

export function getFolderPath() {
	return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../');
}

export function getCacheFolderPath() {
	return path.resolve(getFolderPath(), '../../cache');
}

export function getCacheFilePath(dirPath: string, type: string, name: string, format = 'png') {
	const subdirs = [type];

	if (type == 'texture' || type == 'head') {
		subdirs.push(name.slice(0, 2));
	}

	if (type == 'leather' || type == 'potion') {
		subdirs.push(name.split('_')[0]);
	}

	if (!fs.pathExistsSync(path.resolve(dirPath, subdirs.join('/')))) {
		for (let i = 1; i <= subdirs.length; i++) {
			const checkDirs = subdirs.slice(0, i);
			const checkPath = path.resolve(dirPath, checkDirs.join('/'));

			if (!fs.pathExistsSync(checkPath)) {
				fs.mkdirSync(checkPath);
			}
		}
	}

	return path.resolve(dirPath, `${subdirs.join('/')}/${type}_${name}.${format}`);
}
