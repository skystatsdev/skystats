import type { ParamMatcher } from '@sveltejs/kit';

export const match = ((param) => {
	return /^[0-9a-fA-F]+$/.test(param);
}) satisfies ParamMatcher;

export const isTextureID = match;
