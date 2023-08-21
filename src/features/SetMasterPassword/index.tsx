import { useState, useEffect } from 'react'
import tw from 'twrnc'
import { useDispatch } from 'react-redux'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { View } from 'react-native'

import { Button, TextInput as PaperTextInput, Text } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import Content from '@components/Content'
import { saveMasterPassword } from '@src/store/slices/authSlice'
import { initialize } from '@src/store/slices/appSlice'

import { AppDispatch } from '@src/store'
import FormValidationErrors from '../Login/component/FormValidationErrors'
import Screen from '@src/components/Screen'

export default function SetMasterPassword() {
	const dispatch = useDispatch<AppDispatch>()
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const [password, setPassword] = useState('')
	const [confirmPassword, setCfmPassword] = useState('')
	const [errors, setErrors] = useState<string[]>([])

	const [hidePassword, setHidePassword] = useState(true)
	const [hideConfirmPassword, setHideCfmPassword] = useState(true)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		dispatch(initialize)
	}, [dispatch])

	function validatePassword(pwd: string, cfmPwd: string): boolean {
		const errorMessages = []
		let valid = true
		if (pwd.length < 6) {
			errorMessages.push(i18n.t('set-master-password:error:password:strength', { char: 6 }))
			valid = false
		}
		if (pwd.localeCompare(cfmPwd) !== 0) {
			errorMessages.push(i18n.t('set-master-password:error:password:confirm'))
			valid = false
		}
		setErrors(errorMessages)
		return valid
	}

	function onChangePassword(text: string) {
		validatePassword(text, confirmPassword)
		setPassword(text)
	}

	function onChangeConfirmPassword(text: string) {
		validatePassword(password, text)
		setCfmPassword(text)
	}

	async function onSavePassword() {
		setIsLoading(true)
		if (validatePassword(password, confirmPassword)) {
			const success = await dispatch(saveMasterPassword(password))
			if (success) {
				navigation.navigate('PasswordRecovery:Form')
				// navigation.navigate('App', { name: 'Dashboard', params: {} })
			} else {
				setErrors([i18n.t('set-master-password:error:save:password')])
			}
		}
		setIsLoading(false)
	}

	return (
		<Screen style={tw`p-2`}>
			<Content contentContainerStyle={tw`flex-1 py-5 px-2`}>
				<View style={tw`flex-1 flex-col`}>
					<Text style={tw`py-1 text-lg font-bold`}>{i18n.t('app:name:title')}</Text>

					<Text style={tw`py-1`}>
						This is an offline password app where you could keep your password entries in encrypted manner. Another
						feature of this app is you can create different profiles for your family or loved ones so that you can help
						to keep track
					</Text>

					<PaperTextInput
						mode="outlined"
						label={i18n.t('set-master-password:text:password')}
						value={password}
						onChangeText={onChangePassword}
						secureTextEntry={hidePassword}
						right={
							<PaperTextInput.Icon
								icon={hidePassword ? 'eye-off' : 'eye'}
								style={tw`p-0 m-0`}
								onPress={() => setHidePassword(!hidePassword)}
							/>
						}
						error={errors.length > 0}
					/>
					<PaperTextInput
						mode="outlined"
						label={i18n.t('set-master-password:text:confirm-password')}
						value={confirmPassword}
						onChangeText={onChangeConfirmPassword}
						secureTextEntry={hideConfirmPassword}
						right={
							<PaperTextInput.Icon
								icon={hideConfirmPassword ? 'eye-off' : 'eye'}
								style={tw`p-0 m-0`}
								onPress={() => setHideCfmPassword(!hideConfirmPassword)}
							/>
						}
					/>

					<FormValidationErrors validationErrors={errors} />

					<Button onPress={onSavePassword} mode="contained" style={tw`my-5`}>
						{i18n.t('set-master-password:button:set-password')}
					</Button>
					<Text>{`** ${i18n.t('set-master-password:text:note:enter-password')}`}</Text>

					{/* SL:TODO remove */}
					<Button
						loading={isLoading}
						onPress={() => navigation.navigate({ name: 'Login', params: {} })}
						mode="contained"
						style={tw`my-5`}
					>
						{'Go to Login'}
					</Button>
				</View>
			</Content>
		</Screen>
	)
}
