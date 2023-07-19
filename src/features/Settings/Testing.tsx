import tw from 'twrnc'
import Content from '@components/Content'
import Container from '@src/components/Container'
import { Portal } from 'react-native-paper'
import PasswordEmergencySheet from '@src/features/EmergencySheet'

export default function Testing() {
	return (
		<Container style={tw`flex-1 bg-white`}>
			<PasswordEmergencySheet />
		</Container>
	)
}
