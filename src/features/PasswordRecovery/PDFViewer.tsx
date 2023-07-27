import React, { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line react-native/split-platform-components
import { View, Platform, ToastAndroid } from 'react-native'
import tw from 'twrnc'

import { IconButton, Menu } from 'react-native-paper'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as Print from 'expo-print'

import PDF from 'react-native-pdf'
import { i18n } from '@src/app/locale'

import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'
import { MaterialIcons } from '@expo/vector-icons'

export type PasswordRecoveryPDFRef = {
	launch: (uri: string) => Promise<void>
}

type Props = NativeStackScreenProps<RootStackParamList, 'PasswordRecovery:PDF'>

export default function PDFViewer(props: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const { uri, filename } = props.route.params

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const isAndroid = Platform.OS === 'android'
	const refPDF = useRef<any | null>(null)
	const [menuVisibility, setMenuVisibility] = useState<boolean>(false)

	useEffect(() => {
		async function onShare() {
			if (uri) {
				await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' })
			}
		}

		async function onSave() {
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
				await onShare()
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

		async function onPrint() {
			if (isAndroid) {
				await Print.printAsync({ uri: uri })
			} else {
				const selectedPrinter = await Print.selectPrinterAsync() // iOS only
				if (selectedPrinter) {
					await Print.printAsync({
						uri: uri,
						printerUrl: selectedPrinter?.url // iOS only
					})
				}
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
						{isAndroid ? (
							<Menu.Item
								leadingIcon="folder-outline"
								onPress={onSave}
								title={i18n.t('password:recovery:sheet:menu:save')}
							/>
						) : (
							<Menu.Item
								leadingIcon={props => <MaterialIcons name={'ios-share'} {...props} />}
								onPress={onShare}
								title={i18n.t('password:recovery:sheet:menu:share')}
							/>
						)}
						<Menu.Item
							leadingIcon="printer-outline"
							onPress={onPrint}
							title={i18n.t('password:recovery:sheet:menu:print')}
						/>

						{isAndroid && (
							<Menu.Item
								leadingIcon={props => <MaterialIcons name={'share'} {...props} />}
								onPress={onShare}
								title={i18n.t('password:recovery:sheet:menu:share')}
							/>
						)}
					</Menu>
				)
			}
		})
	}, [filename, isAndroid, menuVisibility, navigation, uri])

	async function resetScale() {
		refPDF.current?.setNativeProps({ scale: 1 })
	}

	return uri ? (
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

			<PDF ref={refPDF} style={tw.style(`flex-1`)} source={{ uri }} spacing={0} fitPolicy={0} />
		</View>
	) : null
}
