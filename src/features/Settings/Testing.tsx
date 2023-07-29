import tw from 'twrnc'
import Content from '@components/Content'
import Screen from '@src/components/Screen'
import { Portal } from 'react-native-paper'
import PasswordRecoveryForm from '@src/features/PasswordRecovery/PasswordRecoveryForm'

export default function Testing() {
	return (
		<Screen style={tw`flex-1 bg-white`}>
			<PasswordRecoveryForm />
		</Screen>
	)
}
