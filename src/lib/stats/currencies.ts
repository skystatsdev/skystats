import { ESSENCE } from '$constants';
import type { Essence, SkyBlockProfile, SkyBlockProfileMember } from '$types/hypixel';

export function getCurrencies(userProfile: Partial<SkyBlockProfileMember>, profile: Partial<SkyBlockProfile>) {
	return {
		bank: profile.banking?.balance ?? 0,
		purse: userProfile.currencies?.coin_purse ?? 0,
		motes: userProfile.currencies?.motes_purse ?? 0,
		essence: Object.fromEntries(
			Object.entries(ESSENCE).map(([essence]) => {
				if (!userProfile.currencies?.essence?.[essence.toUpperCase() as Essence]) return [essence, 0];
				return [essence, userProfile.currencies?.essence[essence.toUpperCase() as Essence].current ?? 0];
			})
		) as Record<Lowercase<Essence>, number>
	};
}
