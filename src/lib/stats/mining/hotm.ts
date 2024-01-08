import { HOTM } from '$constants';

export function calcHotmTokens(hotmTier: number, potmTier: number): number {
	let tokens = 0;

	for (let tier = 1; tier <= hotmTier; tier++) {
		tokens += HOTM.rewards.hotm[tier as keyof typeof HOTM.rewards.hotm]?.token_of_the_mountain ?? 0;
	}

	for (let tier = 1; tier <= potmTier; tier++) {
		if ('token_of_the_mountain' in HOTM.rewards.potm[tier as keyof typeof HOTM.rewards.potm]) {
			tokens += HOTM.rewards.hotm[tier as keyof typeof HOTM.rewards.hotm]?.token_of_the_mountain ?? 0;
		}
	}

	return tokens;
}
