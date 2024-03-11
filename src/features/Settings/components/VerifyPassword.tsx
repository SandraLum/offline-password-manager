import { useContext, useState } from 'react'
import { Image, View } from 'react-native'
import { Button, TextInput as PaperTextInput, Text } from 'react-native-paper'
import tw from '@src/libs/tailwind'

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
import Content from '@src/components/Content'

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:VerifyPassword'>

export default function VerifyPassword({ route }: Props) {
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

	async function onNext() {
		setIsLoading(true)
		const { valid, key } = await verifyCurrentPassword()
		const navigateToOptions = route.params.navigateToOptions as OPMTypes.NavigationOptions<
			RootStackParamList,
			'Settings:Backup:BackupGeneration' | 'Settings:ExportCSV:CSVGeneration'
		>
		if (valid && key && navigateToOptions) {
			if (navigateToOptions?.params?.data) {
				navigateToOptions.params.data.key = key
			}
			navigation.navigate(navigateToOptions)
		}
		setIsLoading(false)
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<Content>
				<View style={tw`flex-col p-10 top-[2%] items-center`}>
					<View style={tw`rounded-full bg-teal-100 p-10`}>
						<Image
							resizeMode="contain"
							style={tw`w-[80px] h-[80px]`}
							source={require('../../../../assets/images/icons/app/lock-64x64.png')}
						/>
					</View>

					<Text style={tw`text-xl font-bold text-gray-900 pt-10 text-center`}>
						{i18n.t('settings:verify:label:enter-password')}
					</Text>

					<Text style={tw.style(`text-sm text-gray-500 pb-4 text-center`)}>
						{i18n.t('settings:verify:note:verify-password')}
					</Text>

					<View style={tw`w-full`}>
						<PaperTextInput
							mode="outlined"
							label={i18n.t('settings:verify:text:password')}
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

				<Button mode="contained" style={tw`m-10`} onPress={onNext} loading={isLoading}>
					{i18n.t('button:label:next')}
				</Button>
			</Content>
		</AuthScreen>
	)
}
