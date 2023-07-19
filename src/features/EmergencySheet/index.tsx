import tw from 'twrnc'
import Content from '@components/Content'
import Container from '@src/components/Container'
import { Portal } from 'react-native-paper'
import PasswordEmergencySheet from './PasswordEmergencySheet'

export default function EmergencySheet() {
	return (
		<Container style={tw`flex-1 bg-white`}>
			<PasswordEmergencySheet />
		</Container>
	)
}
