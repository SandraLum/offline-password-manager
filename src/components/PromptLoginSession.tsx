import { AppDispatch } from '@src/store'
import { login } from '@src/store/slices/secureSlice'
import React, { useEffect, useState, useRef } from 'react'
import { AppState, View } from 'react-native'

import { Portal, Modal, IconButton } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import EnterPasswordForm from '../features/Login/component/EnterPasswordForm'
import tw from 'twrnc'

export default function PromptLoginSession() {
	const dispatch = useDispatch<AppDispatch>()
	const appState = useRef(AppState.currentState)
	const [visible, setVisible] = useState(false)

	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)

	useEffect(() => {
		const subscription = AppState.addEventListener('change', nextAppState => {
			if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
				// SL TODO: Check session
				console.log('App has come to the foreground!')
				showModal()
			}
			appState.current = nextAppState
			console.log('AppState', appState.current)
		})

		return () => {
			subscription.remove()
		}
	}, [])

	function onLogin(password: string): Promise<string | null> | void {
		dispatch(login(password))
	}

	function onLoginViaBiometrics() {
		console.log('Login')
	}

	return (
		// <PaperProvider>
		<Portal>
			<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={tw.style(`bg-white p-4 m-4 rounded-lg`)}>
				<View style={tw`absolute items-end pb-2 top-[-5] right-[-3]`}>
					<IconButton
						mode="contained-tonal"
						icon="close"
						size={18}
						iconColor={tw.color('slate-900')}
						style={tw`p-0 m-0`}
						onPress={hideModal}
					/>
				</View>

				<EnterPasswordForm mode="login" onLogin={onLogin} onLoginViaBiometrics={onLoginViaBiometrics} />
			</Modal>
		</Portal>
		// </PaperProvider>
	)
}
