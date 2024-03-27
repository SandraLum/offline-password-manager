import { View, ImageBackground, Platform, Image, Text } from 'react-native'
import { Button } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import tw from '@src/libs/tailwind'

import Content from '@components/Content'
import { unlock } from '@src/store/slices/authSlice'

import { AppDispatch } from '@src/store'
import EnterPasswordForm from './component/EnterPasswordForm'

import { i18n } from '@src/app/locale'
import { factoryReset } from '@src/store/slices/appSlice'
import Screen from '@src/components/Screen'
import { clone } from '@src/common/utils'

// import { syncEntriesWithMKey } from '../Entries/entriesSlice'

export default function Login() {
	const dispatch = useDispatch<AppDispatch>()
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const isAndroid = Platform.OS === 'android'
	const bgImage = require('../../../assets/images/login-bg.jpg')
	const logo = require('../../../assets/images/icon.png')

	async function onLogin(password: string): Promise<string | null> {
		let error = null
		try {
			const success = await dispatch(unlock(password))
			if (!success) {
				error = i18n.t('login:error:password:invalid')
			}
		} catch {
			error = i18n.t('login:error:login:error')
		}
		return error
	}

	function onLoginViaBiometrics() {
		console.log('Login')
	}

	function resetApp() {
		dispatch(factoryReset())
	}

	return (
		<ImageBackground
			source={bgImage}
			blurRadius={isAndroid ? 3 : 6}
			resizeMode="cover"
			imageStyle={{ opacity: 0.7, backgroundColor: 'black' }}
		>
			<Screen style={tw`w-full h-full p-2`}>
				<Content contentContainerStyle={tw`w-full h-full flex-col py-5 px-2`}>
					<View style={tw`flex flex-row items-center`}>
						<Image
							style={tw.style(`h-[25] w-[25] mr-2`)}
							resizeMode="contain"
							source={require('../../../assets/images/icon-192.png')}
						/>

						<Image
							style={tw.style(`w-[50]`, { backgroundColor: 'transparent' })}
							resizeMode="contain"
							source={require('../../../assets/images/app_name.png')}
						/>
					</View>

					{/* <EnterPasswordForm mode="login" onLogin={onLogin} onLoginViaBiometrics={onLoginViaBiometrics} /> */}

					{/* {error && <Text style={tw`text-red-700 py-1`}>{error}</Text>} */}

					{/* SL:TODO remove */}
					{__DEV__ && (
						<Button
							onPress={() => navigation.navigate({ name: 'SetMasterPassword', params: {} })}
							mode="contained"
							style={tw`my-5`}
						>
							{'Go to Set Password'}
						</Button>
					)}

					{/* SL:TODO remove, this is only for dev */}
					{__DEV__ && (
						<Button buttonColor={tw.color('red-500')} onPress={resetApp} mode="contained" style={tw`my-5`}>
							{'Reset Data'}
						</Button>
					)}
				</Content>
			</Screen>
		</ImageBackground>
	)
}
