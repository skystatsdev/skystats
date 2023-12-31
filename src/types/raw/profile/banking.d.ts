export type SkyBlockProfileBanking = {
	balance: number;
	transactions: {
		amount: number;
		timestamp: number;
		action: string;
		initiator_name: string;
	}[];
};
