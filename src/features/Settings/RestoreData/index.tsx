import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import { useDispatch } from 'react-redux'
import { Image, Platform, Text, ToastAndroid, View } from 'react-native'
import { Button } from 'react-native-paper'
import { MaterialIcons } from '@expo/vector-icons'

import { AppDispatch, persistor, RootState, store } from '@src/store'
import { OPMTypes } from '@src/common/types'
import { i18n } from '@src/app/locale'

import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import AuthScreen from '@src/components/AuthScreen'
import LoadingAnimation from '@src/components/LoadingAnimation'
import { RootStackParamList } from '@src/app/routes'

const Buffer = require('buffer/').Buffer

type Props = NativeStackScreenProps<RootStackParamList, 'Settings:Restore'>

export default function Restore() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	async function onNext() {
		navigation.navigate({
			name: 'Settings:Restore:Restoration',
			params: {}
		})
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<View style={tw`p-2 flex-col justify-center items-center p-12`}>
				<View style={tw`rounded-full bg-purple-200 p-12 mb-12`}>
					<Image
						resizeMode="contain"
						style={tw`w-[100px] h-[100px]`}
						source={require('../../../../assets/images/icons/app/restore.png')}
					/>
				</View>

				<Text style={tw`text-neutral-700 text-2xl font-bold`}>{i18n.t('settings:restore:generated:label')}</Text>
				<Text style={tw`text-neutral-500 text-base mt-2`}>{i18n.t('settings:restore:generated:label:note')}</Text>
			</View>

			<Button mode="contained" style={tw.style(`m-10`)} onPress={onNext}>
				{i18n.t('button:label:continue')}
			</Button>
		</AuthScreen>
	)
}
