export type Currencies = {
	coin_purse?: number;
	motes_purse?: number;
	essence?: Record<Essence, EssenceData>;
};

export type Essence = 'WITHER' | 'DRAGON' | 'SPIDER' | 'UNDEAD' | 'DIAMOND' | 'GOLD' | 'ICE' | 'CRIMSON';

type EssenceData = {
	current: number;
};
