import tw from 'twrnc'
import Content from '@components/Content'
import AuthScreen from '@src/components/AuthScreen'
import { Portal } from 'react-native-paper'
import PasswordRecoveryForm from '@src/features/PasswordRecovery/PasswordRecoveryForm'
import ExportOPM from './ExportOPM'
import ImportOPM from './ImportOPM'

export default function Testing() {
	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			{/* <PasswordRecoveryForm /> */}
			<ExportOPM />
			<ImportOPM />
		</AuthScreen>
	)
}
