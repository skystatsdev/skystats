/** @type {import('tailwindcss').Config} */
export default {
	mode: 'jit',
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			},
			backgroundImage: (theme) => ({
				'hero-pattern': 'url(https://sky.shiiyu.moe/resources/img/bg.webp)',
				'footer-texture': 'url(https://sky.shiiyu.moe/resources/img/footer-texture.png)'
			}),
			textShadow: {
				sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
				default: '0 2px 4px rgba(0, 0, 0, 0.1)',
				lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
			}
		},
	},
	plugins: [require('flowbite/plugin')]
};
