import { useCallback, useEffect, useState } from 'react'

import { View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { ParamListBase, useFocusEffect, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import * as SplashScreen from 'expo-splash-screen'

import { initialize, redirectScreen } from '@src/store/slices/appSlice'

import { AppDispatch } from '@src/store'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function AppInitializer() {
	const dispatch = useDispatch<AppDispatch>()
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const screen = useSelector(redirectScreen)
	const [hideSplash, setHideSplash] = useState(false)

	useFocusEffect(
		useCallback(() => {
			dispatch(initialize)
			navigation.navigate({ name: screen, params: {} })

			// Workaround: setTimeout does not work within useCallback, trigger by setting state
			setHideSplash(true)
		}, [dispatch, navigation, screen])
	)

	useEffect(() => {
		let timerId: NodeJS.Timeout
		if (hideSplash) {
			timerId = setTimeout(async () => {
				await SplashScreen.hideAsync()
			}, 10)
		}
		return () => {
			if (timerId) {
				clearTimeout(timerId)
			}
		}
	}, [hideSplash])

	return null
}
