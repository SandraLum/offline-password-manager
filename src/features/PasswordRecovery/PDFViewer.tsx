import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View, Platform } from 'react-native'
import tw from 'twrnc'

import { Button, IconButton, Menu } from 'react-native-paper'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Sharing from 'expo-sharing'

import PDF, { Source } from 'react-native-pdf'
import { i18n } from '@src/app/locale'

import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'
import { MaterialIcons } from '@expo/vector-icons'

import * as DocumentPicker from 'expo-document-picker'

export type PasswordRecoveryPDFRef = {
	launch: (uri: string) => Promise<void>
}

type Props = NativeStackScreenProps<RootStackParamList, 'PasswordRecovery:PDF'>

export default function PDFViewer(props: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const { uri } = props.route.params

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const isAndroid = Platform.OS === 'android'
	const refPDF = useRef<any | null>(null)
	const [pdfSource, setPDFSource] = useState<Source | number | null>(null)
	const [menuVisibility, setMenuVisibility] = useState<boolean>(false)

	const saveAndShare2 = useCallback(async () => {
		const src = pdfSource as Source
		if (src.uri) {
			await Sharing.shareAsync(src.uri, { UTI: '.pdf', mimeType: 'application/pdf' })
		}
	}, [pdfSource])

	useEffect(() => {
		async function saveAndShare() {
			const src = pdfSource as Source
			if (src.uri) {
				await Sharing.shareAsync(src.uri, { UTI: '.pdf', mimeType: 'application/pdf' })
			}
		}

		async function saveFile() {
			if (isAndroid) {
				const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync()

				if (permissions.granted) {
					// Gets SAF URI from response
					const uri = permissions.directoryUri

					// Gets all files inside of selected directory
					const files = await FileSystem.StorageAccessFramework.readDirectoryAsync(uri)
					console.log(`Files inside ${uri}:\n\n${JSON.stringify(files)}`)
				}
			} else {
				await DocumentPicker.getDocumentAsync()
			}
		}

		navigation.setOptions({
			title: 'Password Recovery Sheet',
			headerRight: () => {
				return (
					<Menu
						visible={menuVisibility}
						onDismiss={() => setMenuVisibility(false)}
						statusBarHeight={-2}
						contentStyle={tw`rounded-lg bg-white`}
						anchor={<IconButton icon="dots-vertical" onPress={() => setMenuVisibility(true)} />}
						anchorPosition="bottom"
					>
						<Menu.Item
							leadingIcon="folder-outline"
							onPress={saveFile}
							title={i18n.t('password:recovery:sheet:menu:save')}
						/>
						<Menu.Item
							leadingIcon="printer-outline"
							onPress={saveAndShare}
							title={i18n.t('password:recovery:sheet:menu:print')}
						/>
						<Menu.Item
							leadingIcon={props => <MaterialIcons name={isAndroid ? 'share' : 'ios-share'} {...props} />}
							onPress={saveAndShare}
							title={i18n.t('password:recovery:sheet:menu:share')}
						/>
					</Menu>
				)
			}
		})
		setPDFSource({ uri: uri })
	}, [isAndroid, menuVisibility, navigation, pdfSource, uri])

	async function resetScale() {
		refPDF.current?.setNativeProps({ scale: 1 })
	}

	function onClose() {
		navigation.goBack()
	}

	return pdfSource ? (
		<View style={tw`flex-1 bg-white`}>
			<View style={tw`absolute z-20 right-1 top-1`}>
				<IconButton
					mode="contained-tonal"
					size={34}
					icon="magnify"
					iconColor={tw.color('slate-700')}
					containerColor="white"
					style={tw.style({
						elevation: 6
					})}
					onPress={resetScale}
				/>
			</View>

			<PDF ref={refPDF} style={tw.style(`flex-1`)} source={pdfSource} spacing={0} fitPolicy={0} />

			<View style={tw`flex flex-row justify-end p-3`}>
				<Button mode="contained" onPress={onClose} style={tw`ml-4`}>
					{i18n.t('password:recovery:sheet:button:done')}
				</Button>
			</View>
		</View>
	) : null
}
