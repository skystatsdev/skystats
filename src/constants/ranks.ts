export const RANKS: Record<RankName, RankInformation> = {
	OWNER: {
		color: '#c43c3c',
		tag: 'OWNER'
	},
	ADMIN: {
		color: '#c43c3c',
		tag: 'ADMIN'
	},
	GAME_MASTER: {
		color: '#00aa00',
		tag: 'GM'
	},
	YOUTUBER: {
		color: '#c43c3c',
		tag: 'YOUTUBE'
	},
	SUPERSTAR: {
		color: '#d88f07',
		tag: 'MVP',
		plus: '++',
		plusColor: '#c43c3c'
	},
	MVP_PLUS: {
		color: '#33aec3',
		tag: 'MVP',
		plus: '+',
		plusColor: '#c43c3c'
	},
	MVP: {
		color: '#33aec3',
		tag: 'MVP'
	},
	VIP_PLUS: {
		color: '#40bb40',
		tag: 'VIP',
		plus: '+',
		plusColor: '#d88f07'
	},
	VIP: {
		color: '#40bb40',
		tag: 'VIP'
	},
	'PIG+++': {
		color: '#e668c6',
		tag: 'PIG',
		plus: '+++',
		plusColor: '#33aec3'
	},
	MAYOR: {
		color: '#e668c6',
		tag: 'MAYOR'
	},
	MINISTER: {
		color: '#c43c3c',
		tag: 'MINISTER'
	}
};

export const RANK_PLUS_COLORS: { [color in PlusColor]?: string } = {
	BLACK: '#000000',
	DARK_BLUE: '#0b277a',
	DARK_GREEN: '#00aa00',
	DARK_AQUA: '#038d8d',
	DARK_RED: '#920909',
	DARK_PURPLE: '#a305a3',
	GOLD: '#d88f07',
	GRAY: '#636363',
	DARK_GRAY: '#2f2f2f',
	BLUE: '#4444f3',
	GREEN: '#40bb40',
	AQUA: '#33aec3',
	RED: '#c43c3c',
	LIGHT_PURPLE: '#e668c6',
	YELLOW: 'efc721',
	WHITE: '#929292'
};

export interface RankInformation {
	color: string;
	tag: string;
	plus?: string;
	plusColor?: string;
}

export type PlusColor =
	| 'BLACK'
	| 'DARK_BLUE'
	| 'DARK_GREEN'
	| 'DARK_AQUA'
	| 'DARK_RED'
	| 'DARK_PURPLE'
	| 'GOLD'
	| 'GRAY'
	| 'DARK_GRAY'
	| 'BLUE'
	| 'GREEN'
	| 'AQUA'
	| 'RED'
	| 'LIGHT_PURPLE'
	| 'YELLOW'
	| 'WHITE';

export type RankName =
	| 'OWNER'
	| 'ADMIN'
	| 'GAME_MASTER'
	| 'YOUTUBER'
	| 'SUPERSTAR'
	| 'MVP_PLUS'
	| 'MVP'
	| 'VIP_PLUS'
	| 'VIP'
	| 'MAYOR'
	| 'MINISTER'
	| 'PIG+++';
