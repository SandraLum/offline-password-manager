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
import { useState } from 'react'
import { getMK } from '@src/store/slices/authSlice'

const Buffer = require('buffer/').Buffer

// const TextDecoder = require('text-encoding')

export default function ExportOPM() {
	const dispatch = useDispatch<AppDispatch>()
	const isAndroid = Platform.OS === 'android'

	const [currentPassword, setCurrentPassword] = useState('')
	const [password, setPassword] = useState('')
	const [salt, setSalt] = useState('')

	// SL: TODO replace with password entering ui (think of changing the modal to prompt for password)
	const mk = useSelector(getMK)
	const { version: appVersion } = useSelector((state: RootState) => state.main.app)

	// console.log('persistor', persistor)

	async function onExportOPM() {
		const backupState = clone(dispatch(getBackupState))
		delete backupState['main']?.['_persist']
		delete backupState['secure']?.['_persist']
		// console.log('backupState', backupState)
		// const encoded = await encode(backupState)
		// if (encoded) {
		// 	const decoded = await decode(encoded)
		// }

		// Testing()
		await onDownload(await encode(backupState))
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

	function decode(content: string) {
		try {
			const arrContent = new Uint8Array(content.split(',').map(Number))
			const arr = intArrayShift(arrContent, Math.round(arrContent.length / 10), false)
			const bufB64 = new Buffer(arr, 'binary').toString()
			const decoded = Buffer.from(bufB64, 'base64').toString()
			const decrypted = decrypt(decoded, mk)
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
		} catch (e) {
			console.log('[ERROR] Unable to decode:', e)
		}
	}

	async function onDownload(content: any) {
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

	async function onReadOPM() {
		// SL TODO: read opm file and decode and restore in store/index
		try {
			const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
			console.log('result', result)
			if (result.type === 'success') {
				const content = await FileSystem.readAsStringAsync(result.uri, { encoding: 'utf8' })
				console.log('decoded:content', content)
				const restoreState = decode(content)
				console.log('decoded:restoreState', typeof restoreState)

				// dispatch({ type: 'RESTORE_STATE', payload: restoreState })
			}
			// const val = decode(str)
			// delete backupState['main']?.['_persist']
			// delete backupState['secure']?.['_persist']
		} catch (e) {
			console.warn('[ERROR]: Unable to read/restore backup file')
		}
	}

	return (
		<>
			<Button onPress={onExportOPM}>{`Export OPM`}</Button>

			<View>
				<Text>Restore State</Text>
				<TextInput
					value={currentPassword}
					onChangeText={val => setCurrentPassword(val)}
					label="Enter your master password"
				/>
				<TextInput value={password} onChangeText={val => setPassword(val)} label="Enter your master password" />
				<TextInput value={salt} onChangeText={val => setSalt(val)} label="Enter your salt" />

				<Button onPress={onReadOPM}>{`Read OPM Backup`}</Button>
			</View>
		</>
	)
}
