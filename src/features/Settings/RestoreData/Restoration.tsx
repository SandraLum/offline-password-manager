import { useContext, useState } from 'react'
import { Image, View, ToastAndroid } from 'react-native'
import { Button, TextInput as PaperTextInput, Text, IconButton } from 'react-native-paper'
import tw from 'twrnc'

import AuthScreen from '@src/components/AuthScreen'
import { i18n } from '@src/app/locale'
import { getMK, verifyPassword } from '@src/store/slices/authSlice'
import FormValidationErrors from '@src/features/Login/component/FormValidationErrors'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@src/store'
import { ToastContext } from '@src/common/contexts/ToastContext'

import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'
import { OPMTypes } from '@src/common/types'

// Restore
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker'
import { clone, decrypt, encrypt, formatDate, intArrayShift } from '@src/common/utils'
import * as migrations from '@store/schema/migrations'
import { clearProfiles, profilesAddMany } from '@src/store/slices/profilesSlice'
import { clearEntries, entriesAddMany, syncEntriesWithNewKey } from '@src/store/slices/entriesSlice'
import { setAllowCopy, setAllowScreenCapture } from '@src/store/slices/settingSlice'
import { categoriesAddMany, clearCategories } from '@src/store/slices/categoriesSlice'
import { setCurrentProfile } from '@src/store/slices/appSlice'
import { encryptPassword } from '@src/store/slices/secureSlice'
import Content from '@src/components/Content'
import AlertModal from '@src/components/AlertModal'

const Buffer = require('buffer/').Buffer

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:Restore:Restoration'>

export default function Restoration({ route }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dispatch = useDispatch<AppDispatch>()
	const { invokeToast } = useContext(ToastContext)
	const mk = useSelector(getMK)
	const { version: appVersion } = useSelector((state: RootState) => state.main.app)

	const [password, setPassword] = useState('')
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])
	const [hidePassword, setHidePassword] = useState(true)

	const [isLoading, setIsLoading] = useState(false)
	const [isLoadingFile, setIsLoadingFile] = useState(false)

	const [secretKey, setSecretKey] = useState('')
	const [secretKeyErrors, setSecretKeyErrors] = useState<string[]>([])

	const [hideSecretKey, setHideSecretKey] = useState(false)

	const [backupContent, setBackupContent] = useState<string | undefined>()
	const [backupFile, setBackupFile] = useState<DocumentPicker.DocumentPickerAsset | undefined>()
	const [backupFileErrors, setBackupFileErrors] = useState<string[]>([])

	const [alertVisible, setAlertVisible] = useState(true)
	const showAlert = () => setAlertVisible(true)
	const hideAlert = () => setAlertVisible(false)

	function validatePassword(pwd: string): boolean {
		const errorMessages = []
		let valid = true
		if (pwd.length === 0) {
			errorMessages.push(i18n.t('settings:restore:error:password:empty'))
			valid = false
		}
		setPasswordErrors(errorMessages)
		return valid
	}

	function validateSecretKey(secretK: string): boolean {
		const errorMessages = []
		let valid = true
		if (secretK.length === 0) {
			errorMessages.push(i18n.t('settings:restore:error:secret-key:empty'))
			valid = false
		}
		setSecretKeyErrors(errorMessages)
		return valid
	}

	function validateBackupFile() {
		const errorMessages = []
		let valid = true
		if (!backupFile || !backupContent) {
			valid = false
			errorMessages.push(i18n.t('settings:restore:error:file:empty'))
			invokeToast(i18n.t('settings:restore:error:file:empty'), { dismissDuration: 4000 })
		} else if (backupFile.mimeType !== 'application/octet-stream') {
			valid = false
			errorMessages.push(i18n.t('settings:restore:error:file:invalid'))
			invokeToast(i18n.t('settings:restore:error:file:invalid'), { dismissDuration: 4000 })
		}
		setBackupFileErrors(errorMessages)
		return valid
	}

	async function decode(content: string) {
		try {
			const arrContent = new Uint8Array(content.split(',').map(Number))
			const arr = intArrayShift(arrContent, Math.round(arrContent.length / 10), false)
			const bufB64 = new Buffer(arr, 'binary').toString()
			const decoded = Buffer.from(bufB64, 'base64').toString()

			const sk = await encryptPassword(password, { salt: secretKey }) //masterkey and salt

			const decrypted = decrypt(decoded, sk)
			const parsed = JSON.parse(decrypted)
			if (parsed['[OPM_BKUP]'] && parsed['[OPM_BKUP]'].isBackup === true) {
				if (parsed['[OPM_BKUP]'].version < appVersion) {
					// Prompt the user to update the app if it is of a lower version than the backed up store
					ToastAndroid.show(
						'An older version of your app is detected. Please upgrade your app before restoring the backup.',
						ToastAndroid.LONG
					)
					return
				}
			}
			return parsed
		} catch (e) {
			console.log('[ERROR] Unable to decode:', e)
		}
	}

	async function onPickFile() {
		// SL TODO: read opm file and decode and restore in store/index
		setIsLoadingFile(true)
		try {
			const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
			console.log('result', result)
			if (result.canceled === false && result.assets?.[0]?.uri) {
				const content = await FileSystem.readAsStringAsync(result.assets?.[0]?.uri, { encoding: 'utf8' })
				setBackupFile({ ...result.assets?.[0] })
				console.log({ ...result.assets?.[0] })
				setBackupContent(content)
			}
		} catch (e) {
			console.warn('[ERROR]: Unable to read/restore backup file')
		}
		setIsLoadingFile(false)
	}

	function onRestore() {
		if (validateBackupFile() && validatePassword(password) && validateSecretKey(secretKey)) {
			showAlert()
		}
	}

	async function processRestore() {
		// SL TODO: read opm file and decode and restore in store/index
		try {
			const content = backupContent
			hideAlert()
			console.log('decoded:content', content)
			if (content) {
				console.log('decoded:content', content)
				const decodedState = await decode(content)
				console.log('decoded:decodedState', typeof decodedState)
				// dispatch(restoreState(decodedState))

				// SL TODO: move code to restoreState in redux

				if (decodedState?.['[OPM_BKUP]']) {
					const migratedState = migrations.run(decodedState)
					console.log('migratedState:', JSON.stringify(migratedState))

					const { app, auth, categories, entries, profiles, setting } = migratedState.main

					if (app && profiles?.length) {
						dispatch(setCurrentProfile({ profile: app.currentProfile }))

						// Settings
						dispatch(setAllowCopy(setting.allowCopy))
						dispatch(setAllowScreenCapture(setting.allowScreenCapture))

						if (profiles?.length > 0) {
							dispatch(clearProfiles)
							dispatch(profilesAddMany(profiles))
						}

						if (profiles?.length > 0) {
							dispatch(clearProfiles)
							dispatch(profilesAddMany(profiles))
						}

						if (categories?.length > 0) {
							dispatch(clearCategories)
							dispatch(categoriesAddMany(categories))
						}

						if (entries?.length > 0) {
							dispatch(clearEntries)
							dispatch(entriesAddMany(entries))

							const oldKey = await encryptPassword(password, { salt: secretKey })
							dispatch(syncEntriesWithNewKey(oldKey, mk))
						}
					}
				}
			}
		} catch (e) {
			console.warn('[ERROR]: Restoring backup file', e)
		}
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<Content>
				<View style={tw`p-2 flex-col justify-center px-8 pt-12`}>
					<View style={tw`items-center`}>
						<View style={tw`rounded-full bg-purple-200 p-12 mb-12`}>
							<Image
								resizeMode="contain"
								style={tw`w-[100px] h-[100px]`}
								source={require('../../../../assets/images/icons/app/restore.png')}
							/>
						</View>
					</View>

					<View style={tw`py-2`}>
						{backupFile?.name ? (
							<>
								<Text style={tw`text-base font-bold text-gray-700 py-1`}>Backup File: </Text>
								<View style={tw`flex-row items-center justify-between border-sky-400 border-2 rounded-2 w-full px-2`}>
									<Text style={tw`flex-1 flex-wrap text-sm font-bold text-blue-700 p-1`}>
										Name: {backupFile.name + '\n'}
										Size: {backupFile.size && (backupFile.size / 1000).toFixed(2)}
									</Text>
									<>
										<IconButton
											icon="minus-circle"
											style={tw`m-0`}
											iconColor={tw.color('red-500')}
											onPress={() => {
												setBackupContent(undefined)
												setBackupFile(undefined)
											}}
										/>
										<IconButton icon="file-refresh-outline" iconColor={tw.color('sky-500')} onPress={onPickFile} />
									</>
								</View>
							</>
						) : (
							<>
								<Button
									loading={isLoadingFile}
									mode="outlined"
									labelStyle={tw`font-bold text-base`}
									onPress={onPickFile}
								>
									Select your backup file ...
								</Button>
								<FormValidationErrors validationErrors={backupFileErrors} />
							</>
						)}
					</View>

					<View style={tw`py-2`}>
						<Text style={tw`text-base font-bold text-gray-700 py-1`}>
							{i18n.t('settings:restore:label:enter-password')}
						</Text>

						<PaperTextInput
							mode="outlined"
							label={i18n.t('settings:restore:text:password')}
							value={password}
							onChangeText={setPassword}
							secureTextEntry={hidePassword}
							right={
								<PaperTextInput.Icon
									icon={hidePassword ? 'eye-off' : 'eye'}
									style={tw`p-0 m-0`}
									onPress={() => setHidePassword(!hidePassword)}
								/>
							}
							error={passwordErrors.length > 0}
						/>

						<FormValidationErrors validationErrors={passwordErrors} />
					</View>

					<View style={tw`py-2`}>
						<Text style={tw`text-base font-bold text-gray-700 py-1`}>
							{i18n.t('settings:restore:label:enter-secret-key')}
						</Text>

						<PaperTextInput
							mode="outlined"
							label={i18n.t('settings:restore:text:secret-key')}
							value={secretKey}
							onChangeText={setSecretKey}
							secureTextEntry={hideSecretKey}
							right={
								<PaperTextInput.Icon
									icon={hideSecretKey ? 'eye-off' : 'eye'}
									style={tw`p-0 m-0`}
									onPress={() => setHideSecretKey(!hideSecretKey)}
								/>
							}
							error={secretKeyErrors.length > 0}
						/>

						<FormValidationErrors validationErrors={secretKeyErrors} />
					</View>
				</View>

				<Button mode="contained" style={tw`m-10`} onPress={onRestore} loading={isLoading}>
					{i18n.t('settings:restore:button:label:restore')}
				</Button>

				<AlertModal
					visible={alertVisible}
					icon={{ name: 'exclamation', color: tw.color('slate-100'), size: 36 }}
					iconStyle={{ backgroundColor: tw.color('slate-500') }}
					onDismiss={hideAlert}
				>
					<View style={tw`py-4 flex-col`}>
						<Text style={tw`font-bold text-xl pb-4 text-center`}>
							{i18n.t('settings:restore:warning:prompt:title')}
						</Text>
						<Text style={tw`text-base text-gray-700`}>{i18n.t('settings:restore:warning:prompt:text')}</Text>
					</View>

					<View style={tw`flex-row pt-1 justify-between`}>
						<Button mode="outlined" textColor={tw.color('gray-500')} style={tw`border-gray-500`} onPress={hideAlert}>
							{i18n.t('button:label:no')}
						</Button>
						<Button mode="contained" textColor="white" buttonColor={tw.color('green-600')} onPress={processRestore}>
							{i18n.t('settings:restore:alert:button:label:proceed')}
						</Button>
					</View>
				</AlertModal>
			</Content>
		</AuthScreen>
	)
}
