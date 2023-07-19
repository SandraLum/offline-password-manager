import React, { useEffect, useRef, useState } from 'react'
import { WebView } from 'react-native-webview'
import tw from 'twrnc'
import { useAssetContent } from '@src/common/hooks/useAssetContent'
import { getSalt } from '@src/store/slices/secureSlice'

import { getLocales, getCalendars } from 'expo-localization'
import { Button } from 'react-native-paper'
import * as Print from 'expo-print'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'

export default function PasswordEmergencySheet() {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const content = useAssetContent(require('../../../assets/docs/PasswordEmergency.html'))

	const refWebView = useRef(null)
	const [htmlContent, setHTMLContent] = useState<string | null>('')
	const [runOnceScript, setRunOnceScript] = useState<string | null>()
	const [pdfUri, setPDFWebView] = useState(null)

	useEffect(() => {
		async function init() {
			const sk = await getSalt()
			const createdOn = new Date().toLocaleString()
			console.log('salt', sk)
			const runOnce = `
			const spanSk = document.getElementById('sk');
			spanSk.innerText = spanSk.innerHTML = spanSk.textContent = '${sk}';

			const spanCreatedOn = document.getElementById('createdOn');
			spanCreatedOn.innerText = spanCreatedOn.innerHTML = spanCreatedOn.textContent = '${createdOn}';
		`
			setRunOnceScript(runOnce)
			setHTMLContent(content)

			// console.log('refWebview', refWebView.current)
		}

		init()
	}, [content])

	async function printAndShare() {
		const html = `<h1> Teste </h1>`
		const { uri } = await Print.printToFileAsync({ html })

		// Sharing.shareAsync(uri)
	}

	async function launchPDF(uri) {
		try {
			const cUri = await FileSystem.getContentUriAsync(uri)
			console.log('cUri', cUri)
			await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
				data: uri,
				flags: 1,
				type: 'application/pdf'
			})
		} catch (e) {
			console.log(e)
		}
	}

	async function launchPDFWebView(uri) {
		try {
			const cUri = await FileSystem.getContentUriAsync(uri)
			setPDFWebView(cUri)
		} catch (e) {
			console.log(e)
		}
	}

	async function onMessageEvent(event: { nativeEvent: { data: any } }) {
		// console.log('onMessagenet', event)
		const html = event.nativeEvent.data

		console.log('html', html)
		const { uri } = await Print.printToFileAsync({ html })
		console.log('uri', uri)
		// launchPDF(uri)
		launchPDFWebView(uri)
		// Sharing.shareAsync(uri)
	}

	// const JSScript = `
	//     document.addEventListener("DOMContentLoaded", function (event) {
	//       alert('loaded');
	//       const span = document.getElementById('sk');
	//       span.innerText = span.innerHTML = span.textContent = 'newssssdtext';
	//   })
	// `

	// console.log('content', htmlContent)
	return htmlContent && runOnceScript ? (
		<>
			<WebView
				ref={refWebView}
				style={tw`m-5`}
				source={{ html: htmlContent }}
				javaScriptEnabled={true}
				domStorageEnabled={true}
				startInLoadingState={false}
				scalesPageToFit={false}
				scrollEnabled={true}
				injectedJavaScript={runOnceScript}
				onMessage={onMessageEvent}
				// source={{
				// 	uri: 'https://github.com/facebook/react-native'
				// }}
			/>
			{pdfUri ? <WebView source={{ uri: pdfUri }} scalesPageToFit={false} scrollEnabled={true} /> : null}

			<Button onPress={() => printAndShare()}>{'Save'}</Button>
		</>
	) : null
}
