import { useState, useEffect } from 'react'
import tw from 'twrnc'
import { useDispatch } from 'react-redux'
import { View } from 'react-native'

import { Button, TextInput, Text } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import Container from '@components/Container'
import Content from '@components/Content'
import { setMasterKey } from '@src/store/slices/secureSlice'
import { initialize } from '@src/store/slices/appSlice'

export default function SetMasterPassword({ navigation }) {
	const dispatch = useDispatch()
	const [text, setText] = useState('')

	useEffect(() => {
		dispatch(initialize)
	}, [dispatch])

	function onSetPasswordPressed() {
		dispatch(setMasterKey('Testing Setting Master Key'))
		// dispatch(initialize())
		navigation.navigate('App', { screen: 'Dashboard' })
	}

	return (
		<Container style={tw`p-2`}>
			<Content contentContainerStyle={tw`flex-1 py-5 px-2`}>
				<View style={tw`flex-1 flex-col`}>
					<Text style={tw`py-1`}>Offline Password Manager</Text>
					<TextInput
						mode="outlined"
						placeholder="asdasd"
						label={i18n.t('set-master-password:text:password')}
						value={text}
						onChangeText={text => setText(text)}
					/>
					<TextInput
						mode="outlined"
						label={i18n.t('set-master-password:text:confirm-password')}
						value={text}
						onChangeText={text => setText(text)}
						right={<TextInput.Icon size={48} icon={'account'} />}
					/>
					<Button onPress={onSetPasswordPressed} mode="contained" style={tw`my-5`}>
						{i18n.t('set-master-password:btn:set-password')}
					</Button>
					<Text>{`** ${i18n.t('set-master-password:text:note:enter-password')}`}</Text>
				</View>
			</Content>
		</Container>
	)
}
