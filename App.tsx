import 'react-native-get-random-values'
import 'react-native-gesture-handler'

import { useEffect, useState, useRef } from 'react'
import { AppState, Modal } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import * as ScreenCapture from 'expo-screen-capture'

import { theme, ThemeProvider } from '@src/app/theme'
import { initLocalization } from '@src/app/locale'
import Routes from '@src/app/routes'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { initStore, store, persistor } from '@src/store'
import { ToastProvider } from '@src/common/contexts/ToastContext'

// import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions'

// const applyGlobalPolyfills = () => {
// 	// eslint-disable-next-line @typescript-eslint/no-var-requires
// 	const { TextEncoder, TextDecoder } = require('text-encoding')

// 	polyfillGlobal('TextEncoder', () => TextEncoder)
// 	polyfillGlobal('TextDecoder', () => TextDecoder)
// }

// applyGlobalPolyfills()

export default function App() {
	const [isInitialized, setIsInitialized] = useState(false)

	useEffect(() => {
		const init = async () => {
			await ScreenCapture.preventScreenCaptureAsync()

			initLocalization()
			await initStore()
			setIsInitialized(true)
		}

		init()
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
