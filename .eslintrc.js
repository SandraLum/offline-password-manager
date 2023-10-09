/* eslint-env node */

module.exports = {
	env: {
		browser: true,
		es6: true,
		es2021: true,
		jest: true,
		'react-native/react-native': true
	},
	extends: [
		'@react-native',
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:react-native/all',
		'plugin:@typescript-eslint/recommended'
	],
	parser: '@typescript-eslint/parser',
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true
		}
	},
	plugins: ['react', 'react-native', 'jest', 'react-hooks', '@typescript-eslint'],
	rules: {
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'linebreak-style': ['error', 'windows'],
		quotes: [
			'error',
			'single',
			{
				avoidEscape: true,
				allowTemplateLiterals: true
			}
		],
		semi: ['error', 'never'],
		'react/prop-types': 0,
		'react/react-in-jsx-scope': 'off',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'error'
		// 'react-native/no-unused-styles': 2,
		// 'react-native/split-platform-components': 2,
		// 'react-native/no-inline-styles': 2,
		// 'react-native/no-color-literals': 2,
		// 'react-native/no-raw-text': 2,
		// 'react-native/sort-styles': [
		// 	'error',
		// 	'asc',
		// 	{
		// 		ignoreClassNames: false,
		// 		ignoreStyleProperties: false
		// 	}
		// ]
	}
}
