import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { View, Platform } from 'react-native'
import tw from 'twrnc'

import { Button, IconButton } from 'react-native-paper'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as Sharing from 'expo-sharing'

import PDF, { Source } from 'react-native-pdf'
import { i18n } from '@src/app/locale'

import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated'

export type PasswordRecoveryPDFRef = {
	launch: (uri: string) => Promise<void>
}

export default forwardRef<PasswordRecoveryPDFRef, unknown>(function PasswordRecoveryPDF(props, ref) {
	const isAndroid = Platform.OS === 'android'

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const refPDF = useRef<any | null>(null)
	const [pdfSource, setPDFSource] = useState<Source | number | null>(null)
	const [visiblePDFViewer, setVisiblePDFViewer] = useState(false)

	const showPDFViewer = () => setVisiblePDFViewer(true)
	const hidePDFViewer = () => setVisiblePDFViewer(false)

	useImperativeHandle(ref, () => ({
		async launch(uri) {
			if (!isAndroid) {
				await launchAndroidViewer(uri)
			} else {
				await launchDefaultViewer(uri)
			}
		}
	}))

	async function launchAndroidViewer(uri: string) {
		const cUri = await FileSystem.getContentUriAsync(uri)
		try {
			const result = await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
				data: cUri,
				flags: 1,
				type: 'application/pdf'
			})

			console.log('result', result)
		} catch (e) {
			console.log('[ERROR] Intent launcher ', JSON.stringify(e))
			await launchDefaultViewer(uri)
		}
	}

	async function launchDefaultViewer(uri: string) {
		try {
			setPDFSource({ uri: uri })
			showPDFViewer()
		} catch (e) {
			console.log('[ERROR] Launch Default PDF Viewer', JSON.stringify(e))
		}
	}

	async function SaveAndShare() {
		const src = pdfSource as Source
		if (src.uri) {
			await Sharing.shareAsync(src.uri, { UTI: '.pdf', mimeType: 'application/pdf' })
		}
	}

	async function resetScale() {
		refPDF.current?.setNativeProps({ scale: 1 })
	}

	function onClose() {
		resetScale()
		setPDFSource(null)
		hidePDFViewer()
	}

	return visiblePDFViewer && pdfSource ? (
		<Animated.View entering={SlideInRight} exiting={SlideOutRight} style={tw`absolute h-full w-full z-10`}>
			<View style={tw`flex-1 bg-white rounded-lg p-1`}>
				<View style={tw`absolute z-20 right-1 top-1`}>
					<IconButton
						mode="contained-tonal"
						size={34}
						icon="content-save"
						iconColor={tw.color('slate-700')}
						containerColor="white"
						style={tw.style({
							elevation: 6
						})}
						onPress={SaveAndShare}
					/>

					<IconButton
						mode="contained-tonal"
						size={34}
						icon="printer"
						iconColor={tw.color('slate-700')}
						containerColor="white"
						style={tw.style({
							elevation: 6
						})}
						onPress={SaveAndShare}
					/>

					<IconButton
						mode="contained-tonal"
						size={34}
						icon="magnify-scan"
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
		</Animated.View>
	) : null
})
