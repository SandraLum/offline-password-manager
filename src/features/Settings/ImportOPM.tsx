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
import { restoreState, setCurrentProfile } from '@src/store/slices/appSlice'
import tw from 'twrnc'
import { encryptPassword } from '@src/store/slices/secureSlice'

import * as migrations from '@store/schema/migrations'
import { clearProfiles, profilesAddMany } from '@src/store/slices/profilesSlice'
import { clearEntries, entriesAddMany, syncEntriesWithNewKey } from '@src/store/slices/entriesSlice'
import { setAllowCopy, setAllowScreenCapture } from '@src/store/slices/settingSlice'
import { categoriesAddMany, clearCategories } from '@src/store/slices/categoriesSlice'

const Buffer = require('buffer/').Buffer

// const TextDecoder = require('text-encoding')

export default function ImportOPM() {
	const dispatch = useDispatch<AppDispatch>()

	const isAndroid = Platform.OS === 'android'

	const [currentPassword, setCurrentPassword] = useState('asd123')
	const [backupPassword, setBackupPassword] = useState('asd123')
	const [pin, setPin] = useState('')
	const [salt, setSalt] = useState('2cd15efd9c719530ae1d9245a7564945')
	const [backupContent, setBackupContent] = useState<string | undefined>()

	// SL: TODO replace with password entering ui (think of changing the modal to prompt for password)
	const mk = useSelector(getMK)
	const { version: appVersion } = useSelector((state: RootState) => state.main.app)

	async function decode(content: string) {
		try {
			const arrContent = new Uint8Array(content.split(',').map(Number))
			const arr = intArrayShift(arrContent, Math.round(arrContent.length / 10), false)
			const bufB64 = new Buffer(arr, 'binary').toString()
			const decoded = Buffer.from(bufB64, 'base64').toString()

			const sk = await encryptPassword(backupPassword, { salt }) //masterkey and salt

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
		try {
			const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true })
			console.log('result', result)
			if (result.canceled === false && result.assets?.[0]?.uri) {
				const content = await FileSystem.readAsStringAsync(result.assets?.[0]?.uri, { encoding: 'utf8' })
				console.log('decoded:content', content)
				setBackupContent(content)
			}
		} catch (e) {
			console.warn('[ERROR]: Unable to read/restore backup file')
		}
	}

	async function onImport() {
		// SL TODO: read opm file and decode and restore in store/index
		try {
			const content = backupContent
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

							const oldKey = await encryptPassword(backupPassword, { salt })
							dispatch(syncEntriesWithNewKey(oldKey, mk))
						}
					}
				}
			}
			// dispatch({ type: 'RESTORE_STATE', payload: restoreState })

			// const val = decode(str)
			// delete backupState['main']?.['_persist']
			// delete backupState['secure']?.['_persist']
		} catch (e) {
			console.warn('[ERROR]: Restoring backup file', e)
		}
	}

	function onTestFn() {
		console.log('Testing function')
		// dispatch(setAllowCopy(true))
		dispatch(clearEntries)
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
				<TextInput
					value={backupPassword}
					onChangeText={val => setBackupPassword(val)}
					label="Enter your backup password"
				/>
				<TextInput value={pin} onChangeText={val => setPin(val)} label="Enter your export PIN" />
				<TextInput value={salt} onChangeText={val => setSalt(val)} label="Enter your salt" />

				<Button onPress={onPickFile}>{`Pick backup file`}</Button>
				<Button onPress={onImport}>{`Start Import OPM`}</Button>
				<Button onPress={onTestFn}>{`TestFn`}</Button>
			</View>
		</>
	)
}
