import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$comp: './src/components',
			$lib: './src/lib',
			$params: './src/params',
			$types: './src/types',
			$constants: './src/constants',
			$redis: './src/redis',
			$api: './src/api'
		}
	}
};

export default config;