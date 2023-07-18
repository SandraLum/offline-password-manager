import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, Text, View } from 'react-native'
import { Portal, Modal, Divider } from 'react-native-paper'
import tw from 'twrnc'

import { AppDispatch } from '@src/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import EnterPasswordForm from '../features/Login/component/EnterPasswordForm'
import {
	checkIsSessionValid,
	unlock,
	invalidateSession,
	sessionTimeLeft,
	TimeoutInterval
} from '@src/store/slices/authSlice'
import { i18n } from '@src/app/locale'
import { NavigationContainerRefWithCurrent } from '@react-navigation/core/lib/typescript/src/types'

type Props = {
	isAuthenticated: boolean
	rootNavigation: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>
}

export default function SessionLoginModal({ isAuthenticated, rootNavigation }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const appState = useRef(AppState.currentState)
	const sessionTimerId = useRef<ReturnType<typeof setTimeout> | null>()

	const [visible, setVisible] = useState(false)
	const isSessionValid = useSelector(checkIsSessionValid)

	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)

	const setSessionTimeout = useCallback(
		async (extendTs = 0) => {
			clearTimer()

			const ts = await dispatch(sessionTimeLeft())
			console.log('STM - SETTIMEOUT - TS', ts)
			sessionTimerId.current = setTimeout(() => {
				dispatch(invalidateSession())
			}, ts + extendTs)
		},
		[dispatch]
	)

	useEffect(() => {
		console.log('ROUTE WRAPPER - init ------------------------')
		console.log('isAuthenticated ------------------------', isAuthenticated)

		const subscribeAppState = AppState.addEventListener('change', async nextAppState => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				console.log('STM - setTimeout - subscription')
				if (isAuthenticated) {
					setSessionTimeout()
				}
			}
			appState.current = nextAppState
		})

		const unsubscribeNavigation = rootNavigation?.addListener('state', async (e: any) => {
			// You can get the raw navigation state (partial state object of the root navigator)
			if (isAuthenticated) {
				console.log('setTimeout - State change', e.type)
				await setSessionTimeout(TimeoutInterval) //1min or 900000 = 15min //SLTODO
			}
		})

		return () => {
			console.log('ROUTE WRAPPER - Unmount ------------------------')
			clearTimer()
			subscribeAppState.remove()
			unsubscribeNavigation?.()
			sessionTimerId.current = null
		}
	}, [rootNavigation, setSessionTimeout, isAuthenticated])

	useEffect(() => {
		if (!isAuthenticated) {
			hideModal()
			clearTimer()
		} else if (isAuthenticated && !isSessionValid && !visible) {
			console.log('showModal')
			showModal()
		}
	}, [isAuthenticated, isSessionValid, visible])

	function clearTimer() {
		if (sessionTimerId.current) {
			clearTimeout(sessionTimerId.current)
		}
	}

	async function onLogin(password: string): Promise<string | null> {
		let error = null
		try {
			const success = await dispatch(unlock(password))
			if (success) {
				console.log('STM - setTimeout - onLogin')
				hideModal()
				setSessionTimeout(TimeoutInterval)
			} else {
				error = i18n.t('login:error:password:invalid')
			}
		} catch {
			error = i18n.t('login:error:login:error')
		}
		return error
	}

	return (
		<Portal>
			<Modal
				visible={visible}
				dismissable={false}
				contentContainerStyle={tw.style(`flex-1 justify-start bg-white p-4 m-3 rounded-lg`)}
			>
				{/* Design */}
				<View style={tw.style(`self-center rounded-full w-[70px] h-[70px] bg-teal-700 overflow-hidden`)}>
					<View
						style={tw.style(`bg-teal-200 w-[120px] h-[120px] absolute rounded-full opacity-35`, {
							top: '35%',
							left: '-60%'
						})}
					/>
					<View style={tw.style(`flex items-center p-4`)}>
						<MaterialCommunityIcons name="lock" color="white" size={40} style={tw.style({ elevation: 5 })} />
					</View>
				</View>

				<View style={tw`pt-4`}>
					<Text>{i18n.t('login:session:note:security')}</Text>
					<Divider style={tw`my-2`} />
					<EnterPasswordForm mode="lock" onLogin={onLogin} />
				</View>
			</Modal>
		</Portal>
	)
}
