import { useContext, useState } from 'react'
import { Image, View, ToastAndroid } from 'react-native'
import { Button, TextInput as PaperTextInput, Text, IconButton } from 'react-native-paper'
import tw from '@src/libs/tailwind'

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

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:Restore:RestoreProcess'>

export default function RestoreProcess({ route }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dispatch = useDispatch<AppDispatch>()
	const { invokeToast } = useContext(ToastContext)
	const mk = useSelector(getMK)
	const { version: appVersion } = useSelector((state: RootState) => state.main.app)
	const LoadingStatus = Object.freeze({
		INIT: 1,
		RESTORING: 2,
		COMPLETED: 3,
		ERROR: 4
	})

	const [password, setPassword] = useState('')
	const [passwordErrors, setPasswordErrors] = useState<string[]>([])
	const [hidePassword, setHidePassword] = useState(true)

	const [isLoadingFile, setIsLoadingFile] = useState(false)

	const [secretKey, setSecretKey] = useState('')
	const [secretKeyErrors, setSecretKeyErrors] = useState<string[]>([])

	const [hideSecretKey, setHideSecretKey] = useState(false)

	const [backupContent, setBackupContent] = useState<string | undefined>()
	const [backupFile, setBackupFile] = useState<DocumentPicker.DocumentPickerAsset | undefined>()
	const [backupFileErrors, setBackupFileErrors] = useState<string[]>([])
	const [loadingStatus, setLoadingStatus] = useState<(typeof LoadingStatus)[keyof typeof LoadingStatus]>(
		LoadingStatus.INIT
	)

	const [alertVisible, setAlertVisible] = useState(false)
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
			if (result.canceled === false && result.assets?.[0]?.uri) {
				const content = await FileSystem.readAsStringAsync(result.assets?.[0]?.uri, { encoding: 'utf8' })
				setBackupFile({ ...result.assets?.[0] })
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

	function onDone() {
		navigation.popToTop()
	}

	async function processRestore() {
		try {
			hideAlert()
			setLoadingStatus(LoadingStatus.RESTORING)

			const content = backupContent
			if (content) {
				const decodedState = await decode(content)

				// SL TODO: move this to a background process
				if (decodedState?.['[OPM_BKUP]']) {
					const migratedState = migrations.run(decodedState)
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

					setTimeout(() => {
						setLoadingStatus(LoadingStatus.COMPLETED)
					}, 5000)
				} else {
					throw 'Unable to decode'
				}
			}
		} catch (e) {
			console.warn('[ERROR]: Restoring backup file', e)
			setTimeout(() => {
				setLoadingStatus(LoadingStatus.ERROR)
				ToastAndroid.showWithGravity('Unable to restore your records', 5000, 5)
			}, 2000)
		}
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<Content>
				<View style={tw`flex-col py-10 px-6`}>
					{loadingStatus !== LoadingStatus.COMPLETED && loadingStatus !== LoadingStatus.ERROR && (
						<View style={tw`rounded-full bg-purple-200 p-10 mb-10 self-center`}>
							<Image
								resizeMode="contain"
								style={tw`w-[80px] h-[80px]`}
								source={require('../../../../assets/images/icons/app/restore.png')}
							/>
						</View>
					)}

					{loadingStatus === LoadingStatus.INIT && (
						<>
							<View style={tw`py-2`}>
								{backupFile?.name ? (
									<>
										<Text style={tw`text-base font-bold text-gray-700 py-1`}>Backup File: </Text>
										<View
											style={tw`flex-row items-center justify-between border-sky-400 border-2 rounded-2 w-full px-2`}
										>
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
												<IconButton
													icon="file-refresh-outline"
													style={tw`m-0`}
													iconColor={tw.color('sky-500')}
													onPress={onPickFile}
												/>
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

							<Button mode="contained" style={tw`my-8`} onPress={onRestore}>
								{i18n.t('settings:restore:button:label:restore')}
							</Button>
						</>
					)}

					{loadingStatus === LoadingStatus.RESTORING && (
						<View style={tw`flex justify-center items-center`}>
							<Text style={tw`text-2xl font-bold text-neutral-700`}>Restoring in progress ...</Text>
						</View>
					)}

					{loadingStatus === LoadingStatus.COMPLETED && (
						<>
							<View style={tw`rounded-full bg-green-100 p-1 self-center`}>
								<Image
									resizeMode="contain"
									style={tw`w-[200px] h-[200px]`}
									source={require('../../../../assets/images/icons/app/done-200x200.png')}
								/>
							</View>
							<Text style={tw`text-base text-neutral-500 font-bold text-center py-10`}>
								{i18n.t('settings:restore:processing:success')}
							</Text>

							<Button mode="contained" style={tw`m-10`} onPress={onDone}>
								{i18n.t('button:label:done')}
							</Button>
						</>
					)}

					{loadingStatus === LoadingStatus.ERROR && (
						<>
							<View style={tw`rounded-full bg-red-100 p-8 self-center`}>
								<Image
									resizeMode="contain"
									style={tw`w-[80px] h-[80px]`}
									source={require('../../../../assets/images/icons/app/error-doc-64x64.png')}
								/>
							</View>
							<Text style={tw`text-base text-neutral-700 text-center p-8`}>
								{i18n.t('settings:restore:processing:error')}
							</Text>
						</>
					)}

					<AlertModal
						dismissable={false}
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
				</View>
			</Content>
		</AuthScreen>
	)
}
