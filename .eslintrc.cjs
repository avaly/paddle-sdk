module.exports = {
	env: {
		es6: true,
		node: true,
		jest: true,
	},
	extends: [
		'eslint:recommended',
		'prettier',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:@typescript-eslint/recommended-requiring-type-checking'
	],
	parser: '@typescript-eslint/parser',
	// parserOptions: {
	// 	project: true,
	// 	tsconfigRootDir: __dirname,
	// },
	plugins: ['@typescript-eslint'],
	rules: {
		indent: ['error', 'tab'],
		'linebreak-style': ['error', 'unix'],
		'no-else-return': ['error'],
		quotes: ['error', 'single'],
		'prefer-arrow-callback': ['error'],
		'prefer-const': ['error'],
		semi: ['error', 'always'],
	},
};
