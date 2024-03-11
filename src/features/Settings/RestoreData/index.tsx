import React from 'react'
import tw from '@src/libs/tailwind'

import { Image, Text, View } from 'react-native'
import { Button } from 'react-native-paper'
import { i18n } from '@src/app/locale'

import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import AuthScreen from '@src/components/AuthScreen'
import { RootStackParamList } from '@src/app/routes'

const Buffer = require('buffer/').Buffer

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:Restore'>

export default function Restore() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	async function onNext() {
		navigation.navigate({
			name: 'Settings:Restore:RestoreProcess',
			params: {}
		})
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<View style={tw`flex-col p-10 items-center`}>
				<View style={tw`rounded-full bg-purple-200 p-10 mb-10`}>
					<Image
						resizeMode="contain"
						style={tw`w-[80px] h-[80px]`}
						source={require('../../../../assets/images/icons/app/restore.png')}
					/>
				</View>

				<Text style={tw`text-neutral-700 text-2xl font-bold`}>{i18n.t('settings:restore:generated:label')}</Text>
				<Text style={tw`text-neutral-500 text-sm text-center mt-2`}>
					{i18n.t('settings:restore:generated:label:note')}
				</Text>
			</View>

			<Button mode="contained" style={tw.style(`m-10`)} onPress={onNext}>
				{i18n.t('button:label:continue')}
			</Button>
		</AuthScreen>
	)
}
