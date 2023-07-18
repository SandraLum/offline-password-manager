import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput as PaperTextInput, Text } from 'react-native-paper'
import tw from 'twrnc'

import { i18n } from '@src/app/locale'
import FormValidationErrors from './FormValidationErrors'

type Props = {
	mode: 'login' | 'lock'
	onLogin: (password: string) => Promise<string | null> | void
	onLoginViaBiometrics?: () => void
}

export default function EnterPasswordForm(props: Props) {
	const { mode = 'login' } = props
	const [password, setPassword] = useState('')
	const [hidePassword, setHidePassword] = useState(true)

	const [isLoading, setIsLoading] = useState(false)

	const [validationErrors, setValidationErrors] = useState<string[]>([])
	const [toastError, setToastError] = useState<string | null | undefined>()

	useEffect(() => {
		validatePassword(password)
	}, [password])

	function validatePassword(pwd: string) {
		const errorMessages = []
		let valid = true
		if (pwd.length === 0) {
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
		setToastError(null)
		if (validatePassword(password)) {
			const error = await props.onLogin(password)
			if (error) {
				setValidationErrors(() => {
					setToastError(error)
					return [error]
				})
			}
		}
		setIsLoading(false)
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
				<FormValidationErrors validationErrors={validationErrors} toastError={toastError} />

				<Button loading={isLoading} onPress={onLogin} mode="contained" style={tw`my-5`}>
					{i18n.t('login:button:unlock')}
				</Button>
			</View>
		</>
	)
}
