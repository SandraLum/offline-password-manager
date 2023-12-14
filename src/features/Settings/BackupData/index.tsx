import React from 'react'
import tw from 'twrnc'
import { Image, Text, View } from 'react-native'
import { Button } from 'react-native-paper'

import { OPMTypes } from '@src/common/types'
import { i18n } from '@src/app/locale'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import AuthScreen from '@src/components/AuthScreen'
import { RootStackParamList } from '@src/app/routes'

export default function Backup() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	async function onNext() {
		const navigateToOptions = {
			name: 'Settings:Backup:BackupGeneration',
			params: { data: { key: '' } }
		} as OPMTypes.NavigationOptions<RootStackParamList, 'Settings:Backup:BackupGeneration'>

		navigation.navigate({
			name: 'Settings:VerifyPassword',
			params: { navigateToOptions }
		})
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<View style={tw`p-2 flex-col justify-center items-center p-12`}>
				<View style={tw`rounded-full bg-purple-200 p-12 mb-12`}>
					<Image
						resizeMode="contain"
						style={tw`w-[100px] h-[100px]`}
						source={require('../../../../assets/images/icons/app/backup.png')}
					/>
				</View>

				<Text style={tw`text-neutral-700 text-2xl font-bold`}>{i18n.t('settings:backup:generated:label')}</Text>
				<Text style={tw`text-neutral-500 text-base mt-2`}>{i18n.t('settings:backup:generated:label:note')}</Text>
			</View>

			<Button mode="contained" style={tw.style(`m-10`)} onPress={onNext}>
				{i18n.t('button:label:continue')}
			</Button>
		</AuthScreen>
	)
}
