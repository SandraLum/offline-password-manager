import { configureStore } from '@reduxjs/toolkit'
import createSecureStore from 'redux-persist-expo-securestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { mainReducer, secureReducer } from './reducers'
import { combineReducers } from 'redux'
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { encryptTransform } from './storeTransform'

import Reactotron from '../../ReactotronConfig'

// Secure storage
const secureStorage = createSecureStore()

const secretKey = '123456'

const securePersistConfig = {
	key: 'secure',
	storage: secureStorage,
	version: 1,
	transforms: [encryptTransform({ secretKey: secretKey })]
}

// Non-secure (AsyncStorage) storage
const mainPersistConfig = {
	key: 'main',
	storage: AsyncStorage,
	version: 1,
	transforms: [encryptTransform({ secretKey: secretKey })]
}

// // Combine them together
const combinedReducer = combineReducers({
	main: combineReducers(mainReducer),
	secure: persistReducer(securePersistConfig, combineReducers(secureReducer))
})

const appReducer = persistReducer(mainPersistConfig, combinedReducer)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rootReducer = (state: any, action: any) => {
	if (action.type === 'RESET_APP') {
		// remove for all keys defined in your persistConfig(s)
		AsyncStorage.removeItem(`persist:${mainPersistConfig.key}`)
		secureStorage.removeItem(`persist:${securePersistConfig.key}`)

		state = undefined
	}
	return appReducer(state, action)
}

export const store = configureStore({
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

export const persistor = persistStore(store)

export const resetStore = async () => {
	await persistor.purge()
	store.dispatch(resetStore())
	await persistor.flush()
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
