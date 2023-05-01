/* eslint-env node */

module.exports = {
	presets: ['babel-preset-expo'],
	plugins: [
		[
			'module-resolver',
			{
				root: ['./src'],
				alias: {
					'@assets': ['./assets'],
					'@common': './src/common',
					'@utils': './src/common/utils',
					'@components': './src/components',
					'@store': './src/store',
					'@slices': './src/store/slices',
					'@src': './src'
				}
			}
		],

		'react-native-reanimated/plugin'
	]
}
