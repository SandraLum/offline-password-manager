import 'react-native-get-random-values'
import 'react-native-gesture-handler'

import { useEffect, useState, useRef } from 'react'
import { AppState, Modal } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { theme, ThemeProvider } from '@src/app/theme'
import { initLocalization } from '@src/app/locale'
import Routes from '@src/app/routes'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore, store, persistor } from '@src/store'
import PromptLoginSession from '@src/components/PromptLoginSession'

export default function App() {
	const [isInitialized, setIsInitialized] = useState(false)
	const appState = useRef(AppState.currentState)

	useEffect(() => {
		const init = async () => {
			initLocalization()
			await initStore()
			setIsInitialized(true)
		}
		init()

		// const subscription = AppState.addEventListener('change', nextAppState => {
		// 	if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
		// 		// SL TODO: Check session
		// 		console.log('App has come to the foreground!')
		// 	}
		// 	appState.current = nextAppState
		// 	console.log('AppState', appState.current)
		// })

		// return () => {
		// 	subscription.remove()
		// }
	}, [])

	return isInitialized ? (
		<SafeAreaProvider>
			<ThemeProvider theme={theme}>
				<StoreProvider store={store}>
					<PersistGate persistor={persistor}>
						<Routes />
					</PersistGate>
				</StoreProvider>
			</ThemeProvider>
		</SafeAreaProvider>
	) : null
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
