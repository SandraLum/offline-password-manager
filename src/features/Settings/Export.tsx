import { useContext, useState } from 'react'
import { View } from 'react-native'
import { Button, TextInput as PaperTextInput, Text, RadioButton, TouchableRipple } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import { verifyPassword } from '@src/store/slices/authSlice'

import FormValidationErrors from '../Login/component/FormValidationErrors'
import tw from 'twrnc'

import AuthScreen from '@src/components/AuthScreen'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@src/store'
import { selectAllProfiles } from '../../store/slices/profilesSlice'
import { ToastContext } from '@src/common/contexts/ToastContext'

import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

export default function Export() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dispatch = useDispatch<AppDispatch>()
	const { invokeToast } = useContext(ToastContext)

	const allProfiles = useSelector(selectAllProfiles)

	const [currentPassword, setCurrentPassword] = useState('')
	const [currentPasswordErrors, setCurrentPasswordErrors] = useState<string[]>([])

	const [hidecurrentPassword, setHidecurrentPassword] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [profileChecked, setProfileChecked] = useState('')
	const [fileFormatChecked, setFileFormatChecked] = useState<'csv' | 'opm' | string>('')

	const ALLPROFILEID = 'ALL'

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
		if (valid && key) {
			let profileIds = []
			if (profileChecked === ALLPROFILEID) {
				profileIds = allProfiles.map(p => p.id)
			} else {
				profileIds.push(profileChecked)
			}
			console.log('profileIds', profileIds)
			navigation.navigate({
				name: 'Settings:ExportGeneration',
				params: { type: fileFormatChecked, data: { profileIds, key: key } }
			})
		}
		setIsLoading(false)
	}

	return (
		<AuthScreen style={tw`p-4`}>
			<Text style={tw`text-base font-bold text-gray-900 pt-3`}>{i18n.t('settings:export:label:password')}</Text>
			<PaperTextInput
				mode="outlined"
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

			<Text style={tw`text-base font-bold text-gray-900 pt-3`}>
				{i18n.t('settings:export:label:export:file-format')}:
			</Text>

			<View style={tw`rounded-lg bg-white p-1`}>
				{/* <RadioButton.Group onValueChange={newValue => setFileFormat(newValue)} value={fileFormat}> */}
				<View style={tw.style(fileFormatChecked === 'csv' && 'border-2 rounded border-teal-600')}>
					<TouchableRipple style={tw`p-4`} rippleColor="rgba(0, 0, 0, .32)" onPress={() => setFileFormatChecked('csv')}>
						<>
							<View style={tw`flex-row items-center`} pointerEvents="none">
								<RadioButton value="csv" status={fileFormatChecked === 'csv' ? 'checked' : 'unchecked'} />
								<Text style={tw`font-bold text-lg`}>{i18n.t('settings:export:label:export:file-format:csv')}</Text>
							</View>

							<Text style={tw`px-2`}>{i18n.t('settings:export:opm:label:note')}</Text>
						</>
					</TouchableRipple>

					{fileFormatChecked === 'csv' && (
						<View style={tw`pl-10 pb-2`}>
							<Text style={tw`px-2 text-slate-700 `}>
								{i18n.t('settings:export:generated:label:all:profiles:note')}
							</Text>
							<Text style={tw`text-xl font-bold`}>{i18n.t('settings:export:generated:label:all:profiles')}:</Text>

							{allProfiles.map(profile => (
								<TouchableRipple
									key={`csv-profile-${profile.id}`}
									style={tw`flex-row items-center`}
									rippleColor="rgba(0, 0, 0, .32)"
									onPress={() => setProfileChecked(profile.id)}
								>
									<>
										<RadioButton value={profile.id} status={profileChecked === profile.id ? 'checked' : 'unchecked'} />
										<Text style={tw`font-bold text-lg`}>{profile.name}</Text>
									</>
								</TouchableRipple>
							))}

							<TouchableRipple
								key={`csv-profile-all`}
								style={tw`flex-row items-center`}
								rippleColor="rgba(0, 0, 0, .32)"
								onPress={() => setProfileChecked(ALLPROFILEID)}
							>
								<>
									<RadioButton
										value={ALLPROFILEID}
										status={profileChecked === ALLPROFILEID ? 'checked' : 'unchecked'}
									/>
									<Text style={tw`font-bold text-lg`}>{'All of the profiles'}</Text>
								</>
							</TouchableRipple>
						</View>
					)}
				</View>

				<TouchableRipple
					style={tw.style('p-4', fileFormatChecked === 'opm' && 'border-2 rounded border-teal-600')}
					rippleColor="rgba(0, 0, 0, .32)"
					onPress={() => setFileFormatChecked('opm')}
				>
					<>
						<View style={tw`flex-row items-center`} pointerEvents="none">
							<RadioButton value="opm" status={fileFormatChecked === 'opm' ? 'checked' : 'unchecked'} />
							<Text style={tw`font-bold text-lg`}>{i18n.t('settings:export:label:export:file-format:opm')}</Text>
						</View>
						<Text style={tw`px-2`}>{i18n.t('settings:export:backup:note')}</Text>
					</>
				</TouchableRipple>
			</View>

			<Button mode="contained" style={tw`m-1 my-4`} onPress={() => onExport()} loading={isLoading}>
				{i18n.t('settings:export:button:export')}
			</Button>
		</AuthScreen>
	)
}
