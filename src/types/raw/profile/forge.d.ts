export type SkyBlockProfileForge = {
	forge_processes?: Record<string, ForgeProcess>;
};

type ForgeProcess = Record<string, ForgeProcessDetail>;

type ForgeProcessDetail = {
	type: string;
	id: string;
	startTime: number;
	slot: number;
	notified: boolean;
};
