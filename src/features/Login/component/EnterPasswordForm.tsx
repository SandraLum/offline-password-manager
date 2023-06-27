import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import tw from 'twrnc'

import { Button, TextInput as PaperTextInput, Text, IconButton, Snackbar } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import * as LocalAuthentication from 'expo-local-authentication'

type Props = {
	mode: 'login' | 'lock'
	onLogin: (password: string) => Promise<string | null> | void
	onLoginViaBiometrics: () => void
}

export default function EnterPasswordForm(props: Props) {
	const { mode = 'login' } = props
	const [password, setPassword] = useState('')
	const [validationErrors, setValidationErrors] = useState<string[]>([])
	const [hidePassword, setHidePassword] = useState(true)
	const [toastError, setToastError] = useState<string | null>()
	const [isLoading, setIsLoading] = useState(false)
	const [isBiometricSupported, setIsBiometricSupported] = useState(false)
	const [authBiometricTypes, setAuthBiometricTypes] = useState(false)

	const onDismissErrorSnackBar = () => setToastError(null)

	// useEffect(() => {
	// 	if (props.errors?.length) {
	// 		setValidationErrors(props.errors)
	// 	}
	// }, [props.errors])

	useEffect(() => {
		const init = async () => {
			const authenticationType = await LocalAuthentication.supportedAuthenticationTypesAsync()

			const isSupported = await LocalAuthentication.hasHardwareAsync()
			const isEnrolled = await LocalAuthentication.isEnrolledAsync()
			console.log('isSupported', isSupported)
			console.log('isEnrolled', isEnrolled)
			setIsBiometricSupported(isSupported && isEnrolled)
		}
		init()
	}, [])

	function validatePassword() {
		const errorMessages = []
		let valid = true
		if (password.length === 0) {
			errorMessages.push(i18n.t('login:error:password:empty'))
			valid = false
		}

		setValidationErrors(errorMessages)
		return valid
	}

	function onSetPassword(pwd: string) {
		setPassword(pwd)
	}

	async function onLogin() {
		setIsLoading(true)
		if (validatePassword()) {
			const error = await props.onLogin(password)
			if (error) {
				setToastError(error)
				setValidationErrors([error])
			} else {
				setToastError(null)
			}
		}
		setIsLoading(false)
	}

	async function onLoginViaBiometrics() {
		console.log('onLoginViaBiometrics')

		const biometricAuth = await LocalAuthentication.authenticateAsync({
			promptMessage: 'Unlock with Biometrics',
			disableDeviceFallback: false,
			cancelLabel: 'Cancel'
		})

		props.onLoginViaBiometrics()
	}

	async function onTestBiometrics() {
		console.log('Test biometrics')

		const biometricAuth = await LocalAuthentication.authenticateAsync({
			promptMessage: 'Unlock with Biometrics',
			disableDeviceFallback: false,
			cancelLabel: 'Cancel'
		})

		console.log('biometricAuth', biometricAuth)
	}

	return (
		<>
			<View style={tw`flex flex-col`}>
				<Text style={tw`py-1 font-bold text-lg`}>
					{mode === 'login' ? i18n.t('login:text:enter:password') : i18n.t('login:text:enter:password:unlock')}
				</Text>
				<PaperTextInput
					mode="outlined"
					value={password}
					onChangeText={onSetPassword}
					secureTextEntry={hidePassword}
					right={
						<PaperTextInput.Icon
							icon={hidePassword ? 'eye-off' : 'eye'}
							style={tw`p-0 m-0`}
							onPress={() => setHidePassword(!hidePassword)}
						/>
					}
					error={validationErrors.length > 0}
				/>

				{validationErrors.map((e, idx) => {
					let error = e

					if (validationErrors.length > 1) {
						error = '. ' + error
					}
					return (
						<Text key={`pwd-error-${idx}`} style={tw`text-red-700 py-1`}>
							{error}
						</Text>
					)
				})}

				<Button loading={isLoading} onPress={onLogin} mode="contained" style={tw`my-5`}>
					{i18n.t('login:button:unlock')}
				</Button>

				{isBiometricSupported && (
					<View style={tw`items-center pt-5`}>
						<IconButton icon={'fingerprint'} size={42} onPress={onLoginViaBiometrics}></IconButton>
						<Text style={tw`font-bold`}>{`${i18n.t('login:label:biometrics')}`}</Text>
					</View>
				)}

				<View style={tw`items-center pt-5`}>
					<IconButton icon={'fingerprint'} size={42} onPress={onTestBiometrics}></IconButton>
					<Text style={tw`font-bold`}>{`Test ${i18n.t('login:label:biometrics')}`}</Text>
				</View>
			</View>

			{/* Error toast */}
			<Snackbar visible={!!toastError} onDismiss={onDismissErrorSnackBar} style={tw`bg-red-500 font-bold text-lg`}>
				<View style={tw`flex flex-row`}>
					<MaterialCommunityIcons name="close-circle" color="white" size={20} />
					<Text style={tw`text-white font-bold pl-2`}>{toastError}</Text>
				</View>
			</Snackbar>
		</>
	)
}
