import { MD3LightTheme, Provider } from 'react-native-paper'

const theme = {
	...MD3LightTheme,
	myOwnProperty: true,
	colors: {
		header: 'rgb(15, 219, 196)',
		primary: 'rgb(15, 219, 196)', //'rgb(0, 105, 113)',
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
		background: 'rgb(250, 253, 253)', //'rgb(250, 253, 253)',
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
