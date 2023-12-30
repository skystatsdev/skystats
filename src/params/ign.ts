import type { ParamMatcher } from '@sveltejs/kit';

export const isUsername = ((param: string): boolean => {
    //This should handle Legacy IGNs
    return param.length <= 24 && /^[a-zA-Z0-9_]+$/.test(param);
}) satisfies ParamMatcher;
