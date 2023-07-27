import React, { useEffect, useRef, useState } from 'react'
import { View, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import tw from 'twrnc'
import { useAssetContent } from '@src/common/hooks/useAssetContent'
import { getSalt } from '@src/store/slices/secureSlice'

import { Button, Text, ActivityIndicator } from 'react-native-paper'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'

import { WebViewMessageEvent, WebViewSource } from 'react-native-webview/lib/WebViewTypes'
import { i18n } from '@src/app/locale'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'

export default function PasswordRecoveryForm() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const content = useAssetContent(require('./PasswordEmergency.html'))

	const isAndroid = Platform.OS === 'android'
	const refWebView = useRef<WebView>(null)

	const [webviewSource, setWebViewSource] = useState<WebViewSource | null>()
	const [runOnceScript, setRunOnceScript] = useState<string | null>()

	const [isHtmlLoaded, setIsHtmlLoaded] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const today = new Date()
	const filename = `PasswordRecoverySheet_${today.getDate()}_${today.getMonth()}_${today.getFullYear()}.pdf`

	useEffect(() => {
		async function init() {
			const sk = await getSalt()
			const createdOn = new Date().toLocaleString()
			console.log('salt', sk)

			const runOnce = `
			const spanSk = document.getElementById('valSk');
			spanSk.innerText = spanSk.innerHTML = spanSk.textContent = '${sk}';

			const spanCreatedOn = document.getElementById('valCreatedOn');
			spanCreatedOn.innerText = spanCreatedOn.innerHTML = spanCreatedOn.textContent = '${createdOn}';
		`
			setRunOnceScript(runOnce)
			if (content) {
				setWebViewSource({ html: content })
			}
		}

		init()
	}, [content])

	async function convertHTMLToPDF(html: string) {
		const { uri } = await Print.printToFileAsync({ html })
		const finalUri = FileSystem.cacheDirectory + filename
		await FileSystem.copyAsync({ from: uri, to: finalUri })
		return finalUri
	}

	async function onMessageEvent(event: WebViewMessageEvent) {
		console.log('OnClick - MessageEvent')
		const html = event.nativeEvent.data

		// Convert html to PDF
		const uri = await convertHTMLToPDF(html)
		await launchViewer(uri)

		setIsLoading(false)
	}

	async function launchViewer(uri: string) {
		if (!isAndroid) {
			await launchAndroidViewer(uri)
		} else {
			launchDefaultViewer(uri)
		}
	}

	async function launchAndroidViewer(uri: string) {
		const cUri = await FileSystem.getContentUriAsync(uri)
		try {
			await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
				data: cUri,
				flags: 1,
				type: 'application/pdf'
			})
		} catch (e) {
			console.log('[ERROR] Intent launcher ', JSON.stringify(e))
			launchDefaultViewer(uri)
		}
	}

	function launchDefaultViewer(uri: string) {
		navigation.navigate('PasswordRecovery:PDF', { uri: uri, filename: filename })
	}

	function onSaveClicked() {
		setIsLoading(true)
		try {
			const run = `onSavePrint();`
			refWebView?.current?.injectJavaScript(run)
		} catch {
			setIsLoading(false)
		}
	}

	function onClose() {
		navigation.goBack()
	}

	const Loading = () => {
		return (
			<View style={tw`absolute h-full w-full flex flex-col justify-center items-center self-center `}>
				<ActivityIndicator size="large" style={tw`p-3`} />

				<Text style={tw`text-base`}>Generating your password recovery...</Text>
			</View>
		)
	}

	if (!webviewSource || !runOnceScript) return null

	return (
		<>
			<View style={tw`flex-1 m-2 bg-white rounded-lg`}>
				<View style={tw`flex-1`}>
					<WebView
						ref={refWebView}
						source={webviewSource}
						injectedJavaScript={runOnceScript}
						javaScriptEnabled={true}
						domStorageEnabled={true}
						startInLoadingState={true}
						scalesPageToFit={false}
						scrollEnabled={true}
						onMessage={onMessageEvent}
						contentMode="mobile"
						textZoom={100}
						minimumFontSize={12}
						renderLoading={() => <Loading />}
						onLoadEnd={() => setIsHtmlLoaded(true)}
					/>

					{isHtmlLoaded && (
						<View style={tw`flex flex-row justify-end p-3`}>
							<Button mode="contained-tonal" onPress={onClose}>
								{i18n.t('password:recovery:sheet:button:close')}
							</Button>
							<Button mode="contained" loading={isLoading} onPress={onSaveClicked} style={tw`ml-4`}>
								{i18n.t('password:recovery:sheet:button:save-share')}
							</Button>
						</View>
					)}
				</View>
			</View>
		</>
	)
}
