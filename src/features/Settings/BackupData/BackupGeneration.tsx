import { useDispatch } from 'react-redux'
import { Image, Platform, Text, ToastAndroid, View } from 'react-native'
import { Button } from 'react-native-paper'
import * as FileSystem from 'expo-file-system'

import { AppDispatch } from '@src/store'

import { clone, encrypt, formatDate, intArrayShift } from '@src/common/utils'
import { getBackupState } from '@store/slices/settingSlice'
import { i18n } from '@src/app/locale'

import { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import { ToastContext } from '@src/common/contexts/ToastContext'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { schemaMigrationVersion } from '@src/store/schema/migrations'
import AuthScreen from '@src/components/AuthScreen'
import LoadingAnimation from '@src/components/LoadingAnimation'
import { RootStackParamList } from '@src/app/routes'
import Content from '@src/components/Content'

const Buffer = require('buffer/').Buffer

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:Backup:BackupGeneration'>

export default function BackupGeneration({ route }: Props) {
	const { data } = route.params
	const LoadingStatus = Object.freeze({
		INIT: 1,
		LOADING: 2,
		GENERATED: 3,
		GENERATED_CALLBACK: 4,
		COMPLETED: 5,
		ERROR: 6
	})
	const dispatch = useDispatch<AppDispatch>()
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const isAndroid = Platform.OS === 'android'

	const [loadingStatus, setLoadingStatus] = useState<(typeof LoadingStatus)[keyof typeof LoadingStatus]>(
		LoadingStatus.COMPLETED
	)
	const [isSaving, setIsSaving] = useState(false)
	const [generatedData, setGeneratedData] = useState<string | undefined>()

	const { invokeToast } = useContext(ToastContext)

	useEffect(() => {
		let timeoutId: string | number | NodeJS.Timeout | undefined
		async function init() {
			setLoadingStatus(LoadingStatus.LOADING)

			timeoutId = setTimeout(async () => {
				const encryptedData = await onBackup()
				setGeneratedData(encryptedData)
				if (encryptedData) {
					setLoadingStatus(LoadingStatus.GENERATED)
				}
			}, 3000)
		}

		init()

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId)
			}
		}
	}, [])

	async function onBackup() {
		if (data.key) {
			const convertedState = convertStateForExport(clone(dispatch(getBackupState)))
			const encryptedData = await encode(convertedState)
			return encryptedData
		} else {
			invokeToast('Invalid password, please enter your valid password', { dismissDuration: 4000 })
		}
	}

	function convertStateForExport(clonedState: any) {
		const converted: any = {
			'[OPM_BKUP]': { isBackup: true, version: schemaMigrationVersion },
			data: {
				main: {
					app: {},
					auth: {},
					setting: {},
					profiles: [],
					entries: [],
					categories: []
				}
			}
		}

		delete clonedState['main']?.['_persist']
		delete clonedState['secure']?.['_persist']

		const { app, categories, profiles, entries, setting } = clonedState.main

		converted.data.main.app = app
		converted.data.main.setting = setting

		if (profiles.entities) {
			for (const [k, v] of Object.entries(profiles.entities)) {
				converted.data.main.profiles.push(v)
			}
		}

		if (entries.entities) {
			for (const [k, v] of Object.entries(entries.entities)) {
				converted.data.main.entries.push(v)
			}
		}

		if (categories.entities) {
			for (const [k, v] of Object.entries(categories.entities)) {
				converted.data.main.entries.push(v)
			}
		}
		return converted
	}

	async function encode(exportState: any) {
		try {
			const strContent = JSON.stringify(exportState)
			const encrypted = encrypt(strContent, data.key)
			const bufB64 = new Buffer(encrypted).toString('base64')
			const buff = new Uint8Array(Buffer.from(bufB64))
			return intArrayShift(buff, Math.round(buff.length / 10), true).toString()
		} catch (e) {
			console.log('[ERROR] Unable to encode:', e)
		}
	}

	async function saveToDisk(content: any) {
		let result
		try {
			if (isAndroid) {
				const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
					FileSystem.documentDirectory
				)

				if (permissions.granted) {
					// Gets SAF URI from response
					const destinationUri = permissions.directoryUri

					// Gets all files inside of selected directory
					await FileSystem.StorageAccessFramework.readDirectoryAsync(destinationUri)
					const cachedFile = await saveToCache(content)
					if (cachedFile) {
						result = await saveToDestination(cachedFile.fileUri, destinationUri, cachedFile.filename)
					}
				}
			} else {
				// For ios, use the share functionality instead
				// await onShare(record)
			}
		} catch {
			console.error('Unable to save to disk')
		}
		return result
	}

	async function saveToCache(content: any) {
		const createdOn = formatDate(new Date(), 'dd_mm_yyyy')
		const filename = `Backup_${createdOn}.opm.bkup`

		try {
			const fileUri = FileSystem.cacheDirectory + filename

			await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 })
			return { filename, fileUri }
		} catch (e) {
			console.log('[ERROR] Unable to save to cache:', e)
		}
	}

	async function saveToDestination(from: string, to: string, filename: string) {
		try {
			const fileCreatedUri = await FileSystem.StorageAccessFramework.createFileAsync(to, filename, 'application/opm')
			const content = await FileSystem.readAsStringAsync(from, { encoding: 'utf8' })
			await FileSystem.writeAsStringAsync(fileCreatedUri, content, { encoding: 'utf8' })
			ToastAndroid.show(i18n.t('settings:export:generated:toast:saved'), ToastAndroid.SHORT)

			const fileInfo = await FileSystem.getInfoAsync(fileCreatedUri)
			return fileInfo
		} catch (e) {
			console.log('[ERROR] Unable to save to cache:', e)
		}
	}

	async function onSave() {
		setIsSaving(true)
		const saved = await saveToDisk(generatedData)
		if (saved?.exists === true) {
			setLoadingStatus(LoadingStatus.COMPLETED)
		}
		setIsSaving(false)
	}

	function onDone() {
		navigation.popToTop()
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<Content>
				<View style={tw`flex-col p-10 items-center`}>
					{(loadingStatus === LoadingStatus.LOADING ||
						loadingStatus === LoadingStatus.GENERATED ||
						loadingStatus === LoadingStatus.GENERATED_CALLBACK) && (
						// <View style={tw`flex-col items-center top-[2%] p-10`}>
						<>
							<View style={tw`min-h-160px`}>
								<LoadingAnimation
									backgroundColor={tw.color('yellow-200')}
									borderRadius={20}
									bounce={
										loadingStatus === LoadingStatus.GENERATED || loadingStatus === LoadingStatus.GENERATED_CALLBACK
									}
									startMorph={
										loadingStatus === LoadingStatus.GENERATED || loadingStatus === LoadingStatus.GENERATED_CALLBACK
									}
									morphOptions={{
										backgroundColor: tw.color('green-200'),
										borderRadius: 100,
										callBack: () => {
											setLoadingStatus(LoadingStatus.GENERATED_CALLBACK)
										}
									}}
								/>
							</View>
							{loadingStatus === LoadingStatus.LOADING && (
								<>
									<Text style={tw`text-lg text-neutral-500 font-bold text-center p-4`}>
										{i18n.t('settings:backup:label:generating')}
									</Text>
									<Text style={tw`text-sm`}>{i18n.t('label:please:wait')} ...</Text>
								</>
							)}

							{loadingStatus === LoadingStatus.GENERATED_CALLBACK && (
								<>
									<Text style={tw`text-base text-center p-5`}>
										{i18n.t('settings:backup:label:generating:complete')}
									</Text>
									<Button mode="contained" style={tw`m-10`} onPress={onSave} loading={isSaving}>
										{i18n.t('settings:backup:button:save')}
									</Button>
								</>
							)}
							{/* </View> */}
						</>
					)}
					{loadingStatus === LoadingStatus.ERROR && (
						// <View style={tw`flex-1 flex-col items-center top-[5%] px-12`}>
						<>
							<View style={tw`rounded-full bg-red-100 p-14`}>
								<Image
									resizeMode="contain"
									style={tw`w-[100px] h-[100px]`}
									source={require('../../../../assets/images/icons/app/error-doc-64x64.png')}
								/>
							</View>
							<Text style={tw`text-xl text-neutral-500 font-bold text-center py-10`}>
								{i18n.t('settings:backup:processing:error')}
							</Text>
						</>
						// </View>
					)}

					{loadingStatus === LoadingStatus.COMPLETED && (
						<>
							<View style={tw`rounded-full bg-green-100 p-1`}>
								<Image
									resizeMode="contain"
									style={tw`w-[200px] h-[200px]`}
									source={require('../../../../assets/images/icons/app/done-200x200.png')}
								/>
							</View>
							<Text style={tw`text-base text-neutral-500 font-bold text-center py-10`}>
								{i18n.t('settings:backup:processing:success')}
							</Text>

							<Button mode="contained" style={tw`w-full mt-10 mb-2`} onPress={onDone}>
								{i18n.t('button:label:done')}
							</Button>
							<Button mode="text" onPress={onSave}>
								{i18n.t('settings:backup:button:save:again')}
							</Button>
						</>
					)}
				</View>
			</Content>
		</AuthScreen>
	)
}
