export type HypixelRequestOptions = {
	endpoint?: string;
	query?: Record<string, any>;
	usesApiKey?: boolean;
};

export interface HypixelPlayerResponse {
	success: true;
	player: HypixelPlayerData;
}
