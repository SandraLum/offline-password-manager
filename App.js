import 'react-native-get-random-values'
import 'react-native-gesture-handler'

import Routes from './src/app/routes'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { theme, ThemeProvider } from '@src/app/theme'
import { initLocalization } from '@src/app/locale'

import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@src/store'

export default function App() {
	initLocalization()

	return (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<StoreProvider store={store}>
					<PersistGate persistor={persistor}>
						<Routes />
					</PersistGate>
				</StoreProvider>
			</ThemeProvider>
		</SafeAreaProvider>
	)
}

if (__DEV__) {
	import('./ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

// if (typeof global.ExpoModules.ExpoRandom.getRandomBase64String === 'undefined') {
// 	console.log('global.expo', global.expo.modules)
// 	if (typeof global.ExpoModules?.ExpoCrypto?.getRandomBase64String === 'function') {
// 		global.ExpoModules.ExpoRandom['getRandomBase64String'] = global.ExpoModules.ExpoCrypto.getRandomBase64String
// 	}
// }
