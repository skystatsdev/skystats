import { match as ign } from '$params/ign';
import { match as uuid } from '$params/uuid';

import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return ign(param) || uuid(param);
}) satisfies ParamMatcher;

export const isUsernameOrUUID = match;
