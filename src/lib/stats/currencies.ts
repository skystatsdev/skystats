import { ESSENCE } from '$constants';
import type {
    SkyblockEssence,
	SkyblockProfile,
	SkyblockProfileMember,
} from '$types/hypixel';

export function getCurrencies(userProfile: Partial<SkyblockProfileMember>, profile: Partial<SkyblockProfile>) {
    return {
        bank: profile.banking?.balance ?? 0,
        purse: userProfile.currencies?.coin_purse ?? 0,
        motes: userProfile.currencies?.motes_purse ?? 0,
        essence: Object.fromEntries(
            Object.entries(ESSENCE).map(([essence, _]) => {
                if (!userProfile.currencies?.essence?.[essence.toUpperCase() as SkyblockEssence]) return [essence, 0];
                return [essence, userProfile.currencies?.essence[essence.toUpperCase() as SkyblockEssence].current ?? 0];
            })
        ) as Record<Lowercase<SkyblockEssence>, number>,
    }
}