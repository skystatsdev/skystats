import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: {
			enabled: true,
		},
		watch: true,
		setupFiles: ['./test/setup.ts'],
		testTimeout: 5000,
		isolate: false,
		reporters: 'default',
		silent: false,
	}
});
