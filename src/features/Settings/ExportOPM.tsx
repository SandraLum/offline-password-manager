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

const Buffer = require('buffer/').Buffer

// const TextDecoder = require('text-encoding')

export default function ExportOPM() {
	const dispatch = useDispatch<AppDispatch>()
	const isAndroid = Platform.OS === 'android'
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
			const clonedState = clone(dispatch(getBackupState))
			delete clonedState['main']?.['_persist']
			delete clonedState['secure']?.['_persist']
			// console.log('backupState', clonedState)
			// const encoded = await encode(clonedState)
			// if (encoded) {
			// 	const decoded = await decode(encoded)
			// }

			// Testing()
			await saveToDisk(await encode(clonedState))
		} else {
			invokeToast('Invalid password, please enter your valid password', { dismissDuration: 4000 })
		}
	}

	async function encode(content: any) {
		try {
			content['[OPM_BKUP]'] = { isBackup: true, version: appVersion }

			const strContent = JSON.stringify(content)
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
			<Button mode="outlined" onPress={onExportOPM}>{`Export OPM`}</Button>
		</>
	)
}
