export type SkyBlockItemQuery = {
	skyblockId?: string;
	name?: string;
	item_id?: number;
	id?: number;
	damage?: number;
	pack?: string[];
	texture?: string;
};

export type RenderItemOutput = {
	mime?: string | undefined;
	path?: string;
	debug?: textureDebug;
	image?: BUffer;
	error?: string;
};

export type SkyBlockItem = {
	id: number;
	damage: number;
	Count: number;
	tag: {
		ExtraAttributes: {
			id?: string;
		};
		display?: {
			Name: string;
		};
	};
	texture?: string;
	texture_path?: string;
};

export type SkyBlockDBItem = {
	material?: string;
	skin?: string;
	name?: string;
	category?: string;
	tier?: string;
	id?: number;
	skyblock_id?: string;
	color?: string;
	damage?: number;
};

export type ResourcePack = {
	base_path: string;
	config: {
		id: string;
		name: string;
		version: string;
		author: string;
		url: string;
		priority: number;
		default: boolean;
		hash: string;
	};
	files?: string[];
	textures: ItemTexture[];
};

export type ItemTexture = {
	weight: number;
	animated: boolean;
	file: string;
	match: {
		value: string;
		regex: string;
	}[];
	leather: {
		base: string;
		overlay: string;
	};
	path: string;
	id: number;
	damage: number;
	skyblock_id: string;
};

export type OutputPack = {
	base_path: string;
	id: string;
	name: string;
	version: string;
	author: string;
	url: string;
	priority: number;
	hash: string;
};

export type TextureModel = {
	parent: string;
	textures: { [key: string]: string };
	display: {
		[string]: { rotation: []; translation: []; scale: [] };
	};
};

export type TextureMetadata = {
	format: string;
	width: number;
	height: number;
	space: string;
	channels: number;
	depth: string;
	densitiy;
	number;
	isProgressive: boolean;
	hasProfile: boolean;
	hasAlpha: boolean;
};

export type OutputTexture = {
	weight: number;
	file: string;
	path: string;
	debug: DebugStatsOutputTexture;
};

export type DebugStatsOutputTexture = {
	processed_packs: number;
	time_spent_ms: number;
	found_matches: number;
	processed_textures: number;
};

export type TextureAnimation = {
	frames?: AnimationFrame[];
	frametime: number;
	interpolate?: boolean;
};

export type AnimationFrame = {
	index: number;
	time: number;
	totalTime?: number;
};
