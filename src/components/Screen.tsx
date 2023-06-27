import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppState, Text, View } from 'react-native'
import { Portal, Modal, Divider } from 'react-native-paper'
import tw from 'twrnc'

import { AppDispatch } from '@src/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import EnterPasswordForm from '../features/Login/component/EnterPasswordForm'
import { checkIsSessionValid, login, invalidateSession, sessionTimeLeft } from '@src/store/slices/secureSlice'
import { i18n } from '@src/app/locale'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PromptLoginSession({ children }: any) {
	const dispatch = useDispatch<AppDispatch>()
	const appState = useRef(AppState.currentState)
	const sessionTimerId = useRef<ReturnType<typeof setTimeout>>()

	const [visible, setVisible] = useState(false)
	const isSessionValid = useSelector(checkIsSessionValid)

	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)

	const setSessionTimeout = useCallback(
		async (extendTs = 0) => {
			const ts = await dispatch(sessionTimeLeft())
			clearTimer()

			sessionTimerId.current = setTimeout(() => {
				dispatch(invalidateSession())
			}, ts + extendTs)
		},
		[dispatch]
	)

	useEffect(() => {
		const init = async () => {
			setSessionTimeout(900000) //15min
		}

		const subscription = AppState.addEventListener('change', async nextAppState => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				setSessionTimeout()
			}
			appState.current = nextAppState
		})

		init()

		return () => {
			clearTimer()
			subscription.remove()
		}
	}, [dispatch, setSessionTimeout])

	useEffect(() => {
		if (!isSessionValid && !visible) {
			showModal()
		}
	}, [isSessionValid, visible])

	function clearTimer() {
		if (sessionTimerId.current) {
			clearTimeout(sessionTimerId.current)
		}
	}

	async function onLogin(password: string): Promise<string | null> {
		let error = null
		try {
			const success = await dispatch(login(password))
			if (success) {
				hideModal()
				setSessionTimeout()
			} else {
				error = i18n.t('login:error:password:invalid')
			}
		} catch {
			error = i18n.t('login:error:login:error')
		}
		return error
	}

	function onLoginViaBiometrics() {
		console.log('Login')
	}

	return (
		<>
			{children}

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
						<EnterPasswordForm mode="lock" onLogin={onLogin} onLoginViaBiometrics={onLoginViaBiometrics} />
					</View>
				</Modal>
			</Portal>
		</>
	)
}
