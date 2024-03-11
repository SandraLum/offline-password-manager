import tw from '@src/libs/tailwind'
import Content from '@components/Content'
import AuthScreen from '@src/components/AuthScreen'
import { Portal } from 'react-native-paper'
import PasswordRecoveryForm from '@src/features/PasswordRecovery/PasswordRecoveryForm'
import { useDispatch } from 'react-redux'

export default function Testing() {
	const dispatch = useDispatch()
	return <AuthScreen style={tw`flex-1 bg-white`}>{/* <PasswordRecoveryForm /> */}</AuthScreen>
}
