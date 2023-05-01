import { MD3LightTheme, Provider } from 'react-native-paper'
// import { useTheme } from 'react-native-paper'

const theme = {
	...MD3LightTheme,
	// Specify custom property
	myOwnProperty: true,
	// colors: {
	// 	primary: 'rgb(0, 105, 108)',
	// 	onPrimary: 'rgb(255, 255, 255)',
	// 	primaryContainer: 'rgb(106, 247, 251)',
	// 	onPrimaryContainer: 'rgb(0, 32, 33)',
	// 	secondary: 'rgb(74, 99, 99)',
	// 	onSecondary: 'rgb(255, 255, 255)',
	// 	secondaryContainer: 'rgb(204, 232, 232)',
	// 	onSecondaryContainer: 'rgb(4, 31, 32)',
	// 	tertiary: 'rgb(77, 95, 124)',
	// 	onTertiary: 'rgb(255, 255, 255)',
	// 	tertiaryContainer: 'rgb(212, 227, 255)',
	// 	onTertiaryContainer: 'rgb(6, 28, 54)',
	// 	error: 'rgb(186, 26, 26)',
	// 	onError: 'rgb(255, 255, 255)',
	// 	errorContainer: 'rgb(255, 218, 214)',
	// 	onErrorContainer: 'rgb(65, 0, 2)',
	// 	background: 'rgb(250, 253, 252)',
	// 	onBackground: 'rgb(25, 28, 28)',
	// 	surface: 'rgb(250, 253, 252)',
	// 	onSurface: 'rgb(25, 28, 28)',
	// 	surfaceVariant: 'rgb(218, 228, 228)',
	// 	onSurfaceVariant: 'rgb(63, 73, 73)',
	// 	outline: 'rgb(111, 121, 121)',
	// 	outlineVariant: 'rgb(190, 200, 200)',
	// 	shadow: 'rgb(0, 0, 0)',
	// 	scrim: 'rgb(0, 0, 0)',
	// 	inverseSurface: 'rgb(45, 49, 49)',
	// 	inverseOnSurface: 'rgb(239, 241, 241)',
	// 	inversePrimary: 'rgb(70, 218, 222)',
	// 	elevation: {
	// 		level0: 'transparent',
	// 		level1: 'rgb(238, 246, 245)',
	// 		level2: 'rgb(230, 241, 241)',
	// 		level3: 'rgb(223, 237, 236)',
	// 		level4: 'rgb(220, 235, 235)',
	// 		level5: 'rgb(215, 232, 232)'
	// 	},
	// 	surfaceDisabled: 'rgba(25, 28, 28, 0.12)',
	// 	onSurfaceDisabled: 'rgba(25, 28, 28, 0.38)',
	// 	backdrop: 'rgba(41, 50, 50, 0.4)'
	// }
	colors: {
		primary: 'rgb(0, 105, 113)',
		onPrimary: 'rgb(255, 255, 255)',
		primaryContainer: 'rgb(132, 243, 255)',
		onPrimaryContainer: 'rgb(0, 32, 35)',
		secondary: 'rgb(74, 99, 101)',
		onSecondary: 'rgb(255, 255, 255)',
		secondaryContainer: 'rgb(204, 231, 235)',
		onSecondaryContainer: 'rgb(5, 31, 34)',
		tertiary: 'rgb(80, 94, 125)',
		onTertiary: 'rgb(255, 255, 255)',
		tertiaryContainer: 'rgb(216, 226, 255)',
		onTertiaryContainer: 'rgb(11, 27, 54)',
		error: 'rgb(186, 26, 26)',
		onError: 'rgb(255, 255, 255)',
		errorContainer: 'rgb(255, 218, 214)',
		onErrorContainer: 'rgb(65, 0, 2)',
		background: 'rgb(250, 253, 253)',
		onBackground: 'rgb(25, 28, 29)',
		surface: 'rgb(250, 253, 253)',
		onSurface: 'rgb(25, 28, 29)',
		surfaceVariant: 'rgb(218, 228, 229)',
		onSurfaceVariant: 'rgb(63, 72, 74)',
		outline: 'rgb(111, 121, 122)',
		outlineVariant: 'rgb(190, 200, 201)',
		shadow: 'rgb(0, 0, 0)',
		scrim: 'rgb(0, 0, 0)',
		inverseSurface: 'rgb(45, 49, 49)',
		inverseOnSurface: 'rgb(239, 241, 241)',
		inversePrimary: 'rgb(77, 217, 230)',
		elevation: {
			level0: 'transparent',
			level1: 'rgb(238, 246, 246)',
			level2: 'rgb(230, 241, 242)',
			level3: 'rgb(223, 237, 238)',
			level4: 'rgb(220, 235, 236)',
			level5: 'rgb(215, 232, 233)'
		},
		surfaceDisabled: 'rgba(25, 28, 29, 0.12)',
		onSurfaceDisabled: 'rgba(25, 28, 29, 0.38)',
		backdrop: 'rgba(41, 50, 51, 0.4)'
	}
}

export { Provider as ThemeProvider, theme }
