/* eslint-disable @typescript-eslint/naming-convention */
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import builtins from 'rollup-plugin-node-builtins';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$comp: './src/components',
			$lib: './src/lib',
			$params: './src/params',
			$types: './src/types',
			$constants: './src/constants',
			$redis: './src/db/redis',
			$mongo: './src/db/mongo',
			$api: './src/api',
			$stats: './src/lib/stats'
		}
	},
	vite: {
		resolve: {
			alias: {
				fs: builtins
			}
		}
	}
};

export default config;
