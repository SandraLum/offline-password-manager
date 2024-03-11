import React from 'react'
import tw from '@src/libs/tailwind'
import { Image, Text, View } from 'react-native'
import { Button } from 'react-native-paper'

import { OPMTypes } from '@src/common/types'
import { i18n } from '@src/app/locale'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import AuthScreen from '@src/components/AuthScreen'
import { RootStackParamList } from '@src/app/routes'
import Content from '@src/components/Content'

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
			<Content>
				<View style={tw`flex-col p-10 items-center`}>
					<View style={tw`rounded-full bg-purple-200 p-10 mb-10`}>
						<Image
							resizeMode="contain"
							style={tw`w-[80px] h-[80px]`}
							source={require('../../../../assets/images/icons/app/backup.png')}
						/>
					</View>

					<Text style={tw`text-neutral-700 text-xl font-bold`}>{i18n.t('settings:backup:generated:label')}</Text>
					<Text style={tw`text-neutral-500 text-sm mt-3`}>{i18n.t('settings:backup:generated:label:note')}</Text>
				</View>

				<Button mode="contained" style={tw.style(`m-10`)} onPress={onNext}>
					{i18n.t('button:label:continue')}
				</Button>
			</Content>
		</AuthScreen>
	)
}
