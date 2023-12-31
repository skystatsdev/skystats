export type SkyBlockProfileCommunityUpgrades = {
	currently_upgrading?: string;
	upgrade_states: {
		upgrade: string;
		tier: number;
		started_ms: number;
		started_by: string;
		claimed_ms: number;
		claimed_by: string;
		fasttracked: boolean;
	}[];
};
