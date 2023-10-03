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
import { restoreState } from '@src/store/slices/appSlice'
import tw from 'twrnc'

const Buffer = require('buffer/').Buffer

// const TextDecoder = require('text-encoding')

export default function ImportOPM() {
	const dispatch = useDispatch<AppDispatch>()
	const isAndroid = Platform.OS === 'android'

	const [currentPassword, setCurrentPassword] = useState('')
	const [pin, setPin] = useState('')
	const [salt, setSalt] = useState('')

	// SL: TODO replace with password entering ui (think of changing the modal to prompt for password)
	const mk = useSelector(getMK)
	const { version: appVersion } = useSelector((state: RootState) => state.main.app)

	// console.log('persistor', persistor)

	function decode(content: string) {
		try {
			const arrContent = new Uint8Array(content.split(',').map(Number))
			const arr = intArrayShift(arrContent, Math.round(arrContent.length / 10), false)
			const bufB64 = new Buffer(arr, 'binary').toString()
			const decoded = Buffer.from(bufB64, 'base64').toString()

			const bkupMk = '' //masterkey and salt

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

	async function onImport() {
		// SL TODO: read opm file and decode and restore in store/index
		try {
			const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
			console.log('result', result)
			if (result.type === 'success') {
				const content = await FileSystem.readAsStringAsync(result.uri, { encoding: 'utf8' })
				console.log('decoded:content', content)
				const decodedState = decode(content)
				console.log('decoded:decodedState', typeof decodedState)
				dispatch(restoreState(decodedState))

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
			<View style={tw`my-4 py-[1px] bg-sky-500`} />

			{/* Import Feature */}
			<View>
				<Text style={tw`p-3`}>Import Feature</Text>
				<TextInput
					value={currentPassword}
					onChangeText={val => setCurrentPassword(val)}
					label="Enter your master password"
				/>
				<TextInput value={pin} onChangeText={val => setPin(val)} label="Enter your export PIN" />
				<TextInput value={salt} onChangeText={val => setSalt(val)} label="Enter your salt" />

				<Button onPress={onImport}>{`Import OPM`}</Button>
			</View>
		</>
	)
}
