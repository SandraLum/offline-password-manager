import { useDispatch, useSelector } from 'react-redux'
import { Platform, Text, ToastAndroid, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import * as FileSystem from 'expo-file-system'

import { AppDispatch, persistor, RootState, store } from '@src/store'
import { OPMTypes } from '@src/common/types'
import { clone, decrypt, encrypt, formatDate, intArrayShift } from '@src/common/utils'
import { getBackupState } from '../../store/slices/settingSlice'
import { i18n } from '@src/app/locale'

import * as DocumentPicker from 'expo-document-picker'
import * as Crypto from 'expo-crypto'
import { useContext, useState } from 'react'
import { getMK, verifyPassword } from '@src/store/slices/authSlice'
import { restoreState } from '@src/store/slices/appSlice'
import tw from 'twrnc'
import { ToastContext } from '@src/common/contexts/ToastContext'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { schemaMigrationVersion } from '@src/store/schema/migrations'

const Buffer = require('buffer/').Buffer

// const TextDecoder = require('text-encoding')

export default function ExportOPM() {
	const dispatch = useDispatch<AppDispatch>()
	const isAndroid = Platform.OS === 'android'

	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const { invokeToast } = useContext(ToastContext)

	const [currentPassword, setCurrentPassword] = useState('')

	// SL: TODO replace with password entering ui (think of changing the modal to prompt for password)
	const mk = useSelector(getMK)
	const { version: appVersion } = useSelector((state: RootState) => state.main.app)

	// console.log('persistor', persistor)

	async function onExportOPM() {
		const { valid } = await dispatch(verifyPassword(currentPassword))
		console.log('valid', valid)
		if (valid) {
			const convertedState = convertStateForExport(clone(dispatch(getBackupState)))
			// console.log('backupState', clonedState)
			// const encoded = await encode(clonedState)
			// if (encoded) {
			// 	const decoded = await decode(encoded)
			// }

			// Testing()
			await saveToDisk(await encode(convertedState))
			// navigation.navigate({ name: 'PasswordRecovery:Form', params: {} })
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

		console.log('clonedState', JSON.stringify(clonedState))

		const { app, auth, categories, profiles, entries, setting } = clonedState.main
		console.log('profiles', Object.entries(profiles.entities))

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
		console.log('transformedState', converted)
		return converted
	}

	async function encode(exportState: any) {
		try {
			const strContent = JSON.stringify(exportState)
			const encrypted = encrypt(strContent, mk)
			const bufB64 = new Buffer(encrypted).toString('base64')
			const buff = new Uint8Array(Buffer.from(bufB64))
			return intArrayShift(buff, Math.round(buff.length / 10), true).toString()
		} catch (e) {
			console.log('[ERROR] Unable to encode:', e)
		}
	}

	async function saveToDisk(content: any) {
		// console.log('ondownload', content)
		// setSelectRecord(record)
		if (isAndroid) {
			const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
				FileSystem.documentDirectory
			)

			if (permissions.granted) {
				// Gets SAF URI from response
				const destinationUri = permissions.directoryUri
				console.log('destinationUri', destinationUri)

				// Gets all files inside of selected directory
				await FileSystem.StorageAccessFramework.readDirectoryAsync(destinationUri)
				const cachedFile = await saveToCache(content)
				if (cachedFile) {
					await saveToDestination(cachedFile.fileUri, destinationUri, cachedFile.filename)
				}
			}
		} else {
			// For ios, use the share functionality instead
			// await onShare(record)
		}
	}

	async function saveToCache(content: any) {
		const createdOn = formatDate(new Date(), 'dd_mm_yyyy')
		const filename = `Backup_${createdOn}.opm.bkup`

		try {
			const fileUri = FileSystem.cacheDirectory + filename

			// const data: Blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/opm', lastModified: 1010 })
			// const buf: Buffer = Buffer.from(JSON.stringify(content))
			// console.log('buf', buf)
			// const data = await buf.toString('binary')
			// console.log('data', data)

			await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 })
			return { filename, fileUri }
		} catch (e) {
			console.log('[ERROR] Unable to save to cache:', e)
		}
	}

	async function saveToDestination(from: string, to: string, filename: string) {
		// const createdOn = formatDate(new Date(), 'dd_mm_yyyy')
		// const filename = `Backup_${createdOn}.opm.bkup`
		try {
			const fileCreatedUri = await FileSystem.StorageAccessFramework.createFileAsync(to, filename, 'application/opm')
			const content = await FileSystem.readAsStringAsync(from, { encoding: 'utf8' })
			await FileSystem.writeAsStringAsync(fileCreatedUri, content, { encoding: 'utf8' })
			ToastAndroid.show(i18n.t('settings:export:generated:toast:saved'), ToastAndroid.SHORT)

			const fileInfo = await FileSystem.getInfoAsync(fileCreatedUri)
			console.log('fileInfo', fileInfo)
		} catch (e) {
			console.log('[ERROR] Unable to save to cache:', e)
		}
	}

	return (
		<>
			{/* Export Feature */}
			<Text style={tw`p-3`}>Export OPM</Text>

			<TextInput
				value={currentPassword}
				onChangeText={val => setCurrentPassword(val)}
				label="Enter your master password"
			/>

			{/* <TextInput value={pin} onChangeText={val => setPin(val)} label="Set a PIN to export your data" /> */}
			<Button mode="outlined" onPress={onExportOPM}>{`Export OPM`}</Button>
		</>
	)
}
