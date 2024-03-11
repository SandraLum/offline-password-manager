import { useState, useEffect } from 'react'
import tw from '@src/libs/tailwind'
import { useDispatch } from 'react-redux'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { Button, TextInput as PaperTextInput, Text } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import Content from '@components/Content'
import { changeMasterPassword, verifyPassword } from '@src/store/slices/authSlice'
import { initialize } from '@src/store/slices/appSlice'

import { AppDispatch } from '@src/store'
import FormValidationErrors from '../Login/component/FormValidationErrors'
import AuthScreen from '@src/components/AuthScreen'

export default function ChangePassword() {
	const dispatch = useDispatch<AppDispatch>()

	const [isLoading, setIsLoading] = useState(false)
	const [mode, setMode] = useState<'change' | 'success'>('change')
	const [currentPassword, setCurrentPassword] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setCfmPassword] = useState('')
	const [errors, setErrors] = useState<string[]>([])
	const [currentPasswordErrors, setCurrentPasswordErrors] = useState<string[]>([])

	const [hidecurrentPassword, setHidecurrentPassword] = useState(true)
	const [hidePassword, setHidePassword] = useState(true)
	const [hideConfirmPassword, setHideCfmPassword] = useState(true)

	function validatePassword(pwd: string, cfmPwd: string): boolean {
		const errorMessages = []
		let valid = true
		if (pwd.length < 6) {
			errorMessages.push(i18n.t('settings:change-password:error:password:strength', { char: 6 }))
			valid = false
		}
		if (pwd.localeCompare(cfmPwd) !== 0) {
			errorMessages.push(i18n.t('settings:change-password:error:password:confirm'))
			valid = false
		}
		setErrors(errorMessages)
		return valid
	}

	function validateCurrentPassword(pwd: string): boolean {
		const errorMessages = []
		let valid = true
		if (pwd.length === 0) {
			errorMessages.push(i18n.t('settings:change-password:error:password:empty'))
			valid = false
		}
		setCurrentPasswordErrors(errorMessages)
		return valid
	}

	function onChangeCurrentPassword(text: string) {
		setCurrentPassword(text)
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
		// setMode('success')

		if (validateCurrentPassword(currentPassword)) {
			const result = await dispatch(verifyPassword(currentPassword))
			if (!result.valid) {
				setCurrentPasswordErrors([i18n.t('settings:change-password:error:save:current-password')])
			} else if (validatePassword(password, confirmPassword)) {
				const success = await dispatch(changeMasterPassword(password))
				if (success) {
					setMode('success')
				} else {
					setErrors([i18n.t('settings:change-password:error:save:password')])
				}
			}
		}
		setIsLoading(false)
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<Content horizontal={false} contentContainerStyle={tw`pt-5`}>
				{mode === 'change' ? (
					<>
						<MaterialCommunityIcons
							name="shield-lock-open-outline"
							color={tw.color('sky-300')}
							size={64}
							style={tw.style(`bg-sky-100 rounded-full p-5 self-center`)}
						/>
						<View style={tw`px-6 py-3`}>
							<Text style={tw`text-base font-bold text-gray-900 pt-3`}>
								{i18n.t('settings:change-password:label:current-password')}
							</Text>
							<PaperTextInput
								mode="outlined"
								label={i18n.t('settings:change-password:text:current-password')}
								value={currentPassword}
								onChangeText={onChangeCurrentPassword}
								secureTextEntry={hidecurrentPassword}
								right={
									<PaperTextInput.Icon
										icon={hidecurrentPassword ? 'eye-off' : 'eye'}
										style={tw`p-0 m-0`}
										onPress={() => setHidecurrentPassword(!hidecurrentPassword)}
									/>
								}
								error={currentPasswordErrors.length > 0}
							/>
							<FormValidationErrors validationErrors={currentPasswordErrors} />

							<Text style={tw`text-base font-bold text-gray-900 pt-3`}>
								{i18n.t('settings:change-password:label:new-password')}
							</Text>
							<PaperTextInput
								mode="outlined"
								label={i18n.t('settings:change-password:text:password')}
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
								label={i18n.t('settings:change-password:text:confirm-password')}
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
							<Text style={tw`self-center text-sm text-gray-600 py-3`}>
								{i18n.t('settings:change-password:checklist')}
							</Text>

							<Button loading={isLoading} onPress={onSavePassword} mode="contained" style={tw`my-5`}>
								{i18n.t('settings:change-password:button:set-password')}
							</Button>
						</View>
					</>
				) : (
					<>
						<MaterialCommunityIcons
							name="shield-lock"
							color={tw.color('green-100')}
							size={64}
							style={tw.style(`bg-green-400 rounded-full p-5 self-center`)}
						/>
						<View style={tw`p-6`}>
							<Text style={tw`text-2xl font-bold text-green-600 pt-5 self-center`}>
								{i18n.t('settings:change-password:label:success')}
							</Text>

							<Text style={tw`text-base text-gray-800 pt-5 self-center`}>
								{i18n.t('settings:change-password:note:success')}
							</Text>
						</View>
					</>
				)}
			</Content>
		</AuthScreen>
	)
}
