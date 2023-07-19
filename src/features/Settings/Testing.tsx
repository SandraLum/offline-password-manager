import tw from 'twrnc'
import Content from '@components/Content'
import Container from '@src/components/Container'
import { Portal } from 'react-native-paper'
import PasswordEmergencySheet from '../Login/PasswordEmergencySheet'

export default function Testing() {
	return (
		<Container style={tw`flex-1 bg-white`}>
			<Content horizontal={false} contentContainerStyle={tw`pt-5`}>
				<Portal>
					<PasswordEmergencySheet />
				</Portal>
			</Content>
		</Container>
	)
}
