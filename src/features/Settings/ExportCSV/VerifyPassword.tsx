import { useContext, useState } from 'react'
import { Image, View } from 'react-native'
import { Button, TextInput as PaperTextInput, Text } from 'react-native-paper'
import tw from 'twrnc'

import AuthScreen from '@src/components/AuthScreen'
import { i18n } from '@src/app/locale'
import { verifyPassword } from '@src/store/slices/authSlice'
import FormValidationErrors from '@src/features/Login/component/FormValidationErrors'

import { useDispatch } from 'react-redux'
import { AppDispatch } from '@src/store'
import { ToastContext } from '@src/common/contexts/ToastContext'

import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'
import { OPMTypes } from '@src/common/types'

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:ExportCSV:VerifyPassword'>

export default function ExportCSVPassword({ route }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dispatch = useDispatch<AppDispatch>()
	const { invokeToast } = useContext(ToastContext)

	const [currentPassword, setCurrentPassword] = useState('')
	const [currentPasswordErrors, setCurrentPasswordErrors] = useState<string[]>([])

	const [hidecurrentPassword, setHidecurrentPassword] = useState(true)
	const [isLoading, setIsLoading] = useState(false)

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

	async function verifyCurrentPassword() {
		let result: { valid: boolean; key?: string | null } = { valid: false, key: null }
		if (validateCurrentPassword(currentPassword)) {
			result = await dispatch(verifyPassword(currentPassword))
			if (!result.valid || !result.key) {
				result.valid = false
				setCurrentPasswordErrors([i18n.t('settings:change-password:error:save:current-password')])
				invokeToast(i18n.t('settings:change-password:error:save:current-password'))
			}
		}
		return result
	}

	async function onExport() {
		setIsLoading(true)
		const { valid, key } = await verifyCurrentPassword()
		const { navigateToOptions } = route.params
		if (valid && key && navigateToOptions) {
			navigation.navigate({ ...(navigateToOptions as OPMTypes.NavigationOptions), key })
			// navigation.navigate({
			// 	name: 'Settings:ExportGeneration',
			// 	params: { type: 'csv', data: { ...data, key: key } }
			// })
		}
		setIsLoading(false)
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<View style={tw`flex-col px-10 py-6 top-[2%] items-center`}>
				<View style={tw`rounded-full bg-teal-100 p-14`}>
					<Image
						resizeMode="contain"
						style={tw`w-[80px] h-[80px]`}
						source={require('../../../../assets/images/icons/app/lock-64x64.png')}
					/>
				</View>

				<Text style={tw`text-2xl font-bold text-gray-900 pt-5 pt-10 text-center`}>
					{i18n.t('settings:export:label:enter-password')}
				</Text>

				<Text style={tw.style(`text-base font-bold text-gray-400 pb-10 text-center`)}>
					{i18n.t('settings:export:note:verify-password')}
				</Text>

				<View style={tw`w-full`}>
					<PaperTextInput
						mode="flat"
						label={i18n.t('settings:export:text:password')}
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
				</View>
			</View>

			<Button mode="contained" style={tw`m-10`} onPress={onExport} loading={isLoading}>
				{i18n.t('settings:export:button:export')}
			</Button>
		</AuthScreen>
	)
}
