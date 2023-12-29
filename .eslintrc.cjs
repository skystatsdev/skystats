module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:svelte/recommended', 'prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['deprecation', '@typescript-eslint'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		}
	],
	rules: {
		curly: ['warn', 'multi-line', 'consistent'],
		'no-unused-vars': ['error', { args: 'none' }],
		'prefer-const': ['warn', { destructuring: 'all' }],
		'no-constant-condition': ['error', { checkLoops: false }],
		'deprecation/deprecation': 'warn',
		'no-throw-literal': 'error',
		'@typescript-eslint/naming-convention': [
			'warn',
			{ selector: 'variableLike', format: ['camelCase'] },
			{ selector: 'variable', modifiers: ['const'], format: ['camelCase', 'UPPER_CASE'] },
			{ selector: 'variable', modifiers: ['const', 'exported'], format: ['UPPER_CASE'] },
			{ selector: 'typeLike', format: ['PascalCase'] }
		]
	}
};
