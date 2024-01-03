export type Profile = {
	first_join: number;
	personal_bank_upgrade?: number;
	coop_invitation?: {
		confirmed: boolean;
	};
};

export type Banking = {
	balance: number;
	transactions: {
		amount: number;
		timestamp: number;
		action: string;
		initiator_name: string;
	}[];
};

export type CommunityUpgrades = {
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
