import { Image, View } from 'react-native'
import tw from 'twrnc'
import Content from '@components/Content'
import { Button, Text } from 'react-native-paper'
import { i18n } from '@src/app/locale'
import { RootStackParamList } from '@src/app/routes'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import AuthScreen from '@src/components/AuthScreen'

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>

export default function Onboarding({ navigation }: Props) {
	function onNext() {
		navigation.navigate({ name: 'PasswordRecovery:Form', params: {} })
	}
	return (
		<AuthScreen>
			<Content horizontal={false} contentContainerStyle={tw`flex-1 flex-col m-2 bg-white rounded-lg items-center`}>
				<View style={tw.style({ padding: 30 })} />
				<Image
					resizeMode="cover"
					source={require('./images/key-clipart.jpg')}
					style={tw.style(`rounded-full`, { width: 200, height: 200 })}
				/>
				<Text style={tw.style(`text-2xl font-bold p-5 text-center`)}>{i18n.t('onboarding:label:welcome')}</Text>
				<Text style={tw`text-slate-700 text-base px-6 text-center`}>{i18n.t('onboarding:note:success')}</Text>
				<View style={tw.style({ padding: 30 })} />
				<Button mode="contained" onPress={onNext}>
					{i18n.t('onboarding:button:next')}
				</Button>
			</Content>
		</AuthScreen>
	)
}
