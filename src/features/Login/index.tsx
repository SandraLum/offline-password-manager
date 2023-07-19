import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { useDispatch } from 'react-redux'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import tw from 'twrnc'

import Content from '@components/Content'
import { unlock } from '@src/store/slices/authSlice'

import { AppDispatch } from '@src/store'
import EnterPasswordForm from './component/EnterPasswordForm'

import { i18n } from '@src/app/locale'
import { factoryReset } from '@src/store/slices/appSlice'

// import { syncEntriesWithMKey } from '../Entries/entriesSlice'

export default function Login() {
	const dispatch = useDispatch<AppDispatch>()
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

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

	function Testing() {
		console.log('Testing pressed.............')
		// dispatch(syncEntriesWithMKey('qqq111'))
	}

	function resetApp() {
		dispatch(factoryReset())
	}

	return (
		<View style={tw`w-full h-full p-2`}>
			<Content contentContainerStyle={tw`w-full h-full flex-col py-5 px-2`}>
				<EnterPasswordForm mode="login" onLogin={onLogin} onLoginViaBiometrics={onLoginViaBiometrics} />

				{/* {error && <Text style={tw`text-red-700 py-1`}>{error}</Text>} */}

				{/* SL:TODO remove */}
				<Button
					onPress={() => navigation.navigate({ name: 'SetMasterPassword', params: {} })}
					mode="contained"
					style={tw`my-5`}
				>
					{'Go to Set Password'}
				</Button>

				{/* SL:TODO remove */}
				<Button buttonColor={tw.color('blue-500')} onPress={() => Testing()} mode="contained" style={tw`my-5`}>
					{'Testing button'}
				</Button>

				{/* SL:TODO remove */}
				<Button buttonColor={tw.color('red-500')} onPress={resetApp} mode="contained" style={tw`my-5`}>
					{'Reset Data'}
				</Button>
			</Content>
		</View>
	)
}
