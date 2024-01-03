import type { Essence } from '$types/hypixel';

export type SkyblockPlayerCurrencies = {
	bank?: number;
	purse?: number;
	motes?: number;
	essence: Record<Essence, number>;
};
