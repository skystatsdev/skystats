export type SkyblockProfilePetsData = {
	autopet: {
		rules_limit: number;
		rules: {
			uuid: string;
			id: string;
			name: string;
			uniqueId: string;
			exceptions: AutoPetRulesExceptions[];
			disabled: boolean;
			data: Record<AutoPetRulesDataCategory, string>;
		}[];
		migrated: boolean;
		migrated_2: boolean;
	};
	pets: {
		uuid: string;
		uniqueId: string;
		type: string;
		exp: number;
		active: boolean;
		tier: number;
		heldItem?: string;
		candyUsed: number;
		skin?: string;
	}[];
};

type AutoPetRulesExceptions = {
	id: string;
	data: {
		pet: string;
	};
};

type AutoPetRulesDataCategory = 'boss' | 'category' | 'floor' | 'master' | 'entity_type' | 'island' | 'slot';
