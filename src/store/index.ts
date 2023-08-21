import { configureStore, MiddlewareArray, ThunkMiddleware } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { mainReducer, secureReducer } from './reducers'
import { AnyAction, combineReducers } from 'redux'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { encryptTransform } from './storeTransform'

import Reactotron from '../../ReactotronConfig'
import * as SecureStore from './secureStore'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
import { Persistor } from 'redux-persist/es/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let store: ToolkitStore<any, any, MiddlewareArray<[ThunkMiddleware<any, AnyAction, undefined>]>>
let persistor: Persistor
let resetStore: () => void

async function initStore() {
	const secureStorage = SecureStore.createSecureStore()

	await secureStorage.init()

	const mainPersistConfig = {
		key: 'main',
		storage: AsyncStorage,
		version: 1.1,
		transforms: [await encryptTransform(await secureStorage.getSSK())],
		blacklist: ['auth']
	}

	const securePersistConfig = {
		key: 'secure',
		storage: secureStorage,
		version: 1,
		transforms: [await encryptTransform(await secureStorage.getSSK(), true)]
	}

	// // Combine them together
	const appReducer = combineReducers({
		main: persistReducer(mainPersistConfig, combineReducers(mainReducer)),
		secure: persistReducer(securePersistConfig, secureReducer)
	})

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const rootReducer = (state: any, action: any) => {
		if (action.type === 'RESET_APP') {
			// remove for all keys defined in your persistConfig(s)
			AsyncStorage.removeItem(`persist:${mainPersistConfig.key}`)
			secureStorage.removeItem(`persist:${securePersistConfig.key}`)
			state = undefined
		}
		if (action.type === 'RESTORE_STATE') {
			console.log('RESTORE_STATE:payload', action.payload)
			// remove for all keys defined in your persistConfig(s)
			// AsyncStorage.removeItem(`persist:${mainPersistConfig.key}`)
			// secureStorage.removeItem(`persist:${securePersistConfig.key}`)
			state = action.payload
		}
		return appReducer(state, action)
	}

	store = configureStore({
		reducer: rootReducer,
		middleware: getDefaultMiddleware =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] //required for redux-toolkit to work with redux persist
				}
			}),
		enhancers: defaultEnhancers => {
			const reactronEnhancers = Reactotron.createEnhancer?.()
			return reactronEnhancers ? [reactronEnhancers, ...defaultEnhancers] : [...defaultEnhancers]
		},
		devTools: process.env.NODE_ENV !== 'production'
	})

	persistor = persistStore(store)

	resetStore = async () => {
		await persistor.purge()
		store.dispatch(resetStore())
		await persistor.flush()
	}
}

export { initStore, store, persistor, resetStore }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
