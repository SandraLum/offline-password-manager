module.exports = {
	preset: 'jest-expo',
	transformIgnorePatterns: [
		'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|i18n-js)'
	],
	verbose: true,
	setupFiles: ['<rootDir>/jest.setup.js'],
	moduleNameMapper: {
		'^@utils(.*)$': '<rootDir>/src/common/utils$1',
		'^@src(.*)$': '<rootDir>/src/*$1'
	}
}
