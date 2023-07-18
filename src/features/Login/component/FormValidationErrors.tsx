import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import tw from 'twrnc'

import { Text, Snackbar, Portal } from 'react-native-paper'

type Props = {
	validationErrors?: string[]
	toastError?: string | null
	onDismissErrorSnackBar?: Dispatch<SetStateAction<string | null | undefined>>
}

export default function FormValidationErrors(props: Props) {
	const { validationErrors, toastError } = props
	const [toastMessage, setToastMessage] = useState<string | null | undefined>()

	useEffect(() => {
		setToastMessage(toastError)
	}, [toastError])

	const onDismissErrorSnackBar = () => {
		setToastMessage(null)

		if (props.onDismissErrorSnackBar) {
			props.onDismissErrorSnackBar(null)
		}
	}

	return (
		<>
			{validationErrors?.map((e, idx) => {
				let error = e
				if (validationErrors.length > 1) {
					error = '. ' + error
				}
				return (
					<Text key={`pwd-error-${idx}`} style={tw`text-red-700 py-1`}>
						{error}
					</Text>
				)
			})}

			{/* Error toast */}
			<Portal>
				<Snackbar visible={!!toastMessage} onDismiss={onDismissErrorSnackBar} style={tw`bg-red-500 font-bold text-lg`}>
					<View style={tw`flex flex-row`}>
						<MaterialCommunityIcons name="close-circle" color="white" size={20} />
						<Text style={tw`text-white font-bold pl-2`}>{toastMessage}</Text>
					</View>
				</Snackbar>
			</Portal>
		</>
	)
}
