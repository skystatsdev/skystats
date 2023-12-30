import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param: string): boolean => {
    const uuidRegex = /^[a-fA-F0-9]+$/;
    const uuidWithDashesRegex = /^[a-fA-F0-9-]+$/;

    return (param.length === 32 && uuidRegex.test(param)) || 
           (param.length === 36 && uuidWithDashesRegex.test(param));
};
