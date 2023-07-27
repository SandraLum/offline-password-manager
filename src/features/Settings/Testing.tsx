import tw from 'twrnc'
import Content from '@components/Content'
import Container from '@src/components/Container'
import { Portal } from 'react-native-paper'
import PasswordRecoveryForm from '@src/features/PasswordRecovery/PasswordRecoveryForm'

export default function Testing() {
	return (
		<Container style={tw`flex-1 bg-white`}>
			<PasswordRecoveryForm />
		</Container>
	)
}
