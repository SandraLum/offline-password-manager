import { useContext, useState } from 'react'
import { Platform, ToastAndroid, View } from 'react-native'
import { Button, TextInput as PaperTextInput, Text, RadioButton, TouchableRipple, Snackbar } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { changeMasterPassword, verifyPassword } from '@src/store/slices/authSlice'

import FormValidationErrors from '../Login/component/FormValidationErrors'
import tw from 'twrnc'
import Content from '@components/Content'
import AuthScreen from '@src/components/AuthScreen'
import { theme } from '@src/app/theme'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllEntries, selectAllGroupedEntries } from '../../store/slices/entriesSlice'
import { getDataForExport } from '../../store/slices/settingSlice'
import { AppDispatch } from '@src/store'
import { decrypt, formatDate } from '@src/common/utils'
import { OPMTypes } from '@src/common/types'
import { selectAllProfiles, selectProfileById } from '../../store/slices/profilesSlice'
import { ToastContext } from '@src/common/contexts/ToastContext'
import { FieldType, FieldTypes } from '@src/common/templates/entries'
import { RootStackParamList } from '@src/app/routes'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:ExportGenerated'>

export default function ExportGenerated({ route }: Props) {
	const isAndroid = Platform.OS === 'android'

	const { type, files } = route.params

	async function onShare(uri: string) {
		if (uri) {
			await Sharing.shareAsync(uri, { UTI: '.csv', mimeType: 'application/csv' })
		}
	}

	async function onSave({ filename, uri }: { filename: string; uri: string }) {
		if (isAndroid) {
			const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(
				FileSystem.documentDirectory
			)

			if (permissions.granted) {
				// Gets SAF URI from response
				const destinationUri = permissions.directoryUri

				// Gets all files inside of selected directory
				await FileSystem.StorageAccessFramework.readDirectoryAsync(destinationUri)
				await copySAFFileTo(uri, destinationUri, filename)
			}
		} else {
			// For ios, use the share functionality instead
			await onShare(uri)
		}
	}

	async function copySAFFileTo(from: string, to: string, filename: string) {
		try {
			const fileCreatedUri = await FileSystem.StorageAccessFramework.createFileAsync(to, filename, 'application/pdf')
			const content = await FileSystem.readAsStringAsync(from, { encoding: 'base64' })
			await FileSystem.writeAsStringAsync(fileCreatedUri, content, { encoding: 'base64' })
			ToastAndroid.show(i18n.t('password:recovery:sheet:toast:save:success'), ToastAndroid.SHORT)
		} catch (e) {
			console.log('[Error] Saving file to selected folder', e)
		}
	}

	return (
		<AuthScreen style={tw`p-4`}>
			<View style={tw.style('border-2 rounded border-teal-600')}>
				<Text>Congratulations! Your data has been successfully generated. Please click to save your file.</Text>
				{files
					.map((file: OPMTypes.ExportedFile, idx: number) => {
						if (file.type === 'csv') {
							return <Text key={`export-file-${idx}`}>{file.profile?.name}</Text>
						}
					})
					.filter((i: any) => i)}
			</View>

			<Button mode="contained" style={tw`m-1 my-4`}>{`Export Data`}</Button>
		</AuthScreen>
	)
}
