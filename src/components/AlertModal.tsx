import { ReactNode } from 'react'
import { OpaqueColorValue, View } from 'react-native'
import { Modal, Portal } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import tw from 'twrnc'

type Props = {
	visible: boolean
	icon?: {
		name: keyof typeof MaterialCommunityIcons.glyphMap
		size: number
		color: string | OpaqueColorValue | undefined
	}
	iconStyle?: { backgroundColor: string | undefined }
	children: ReactNode
	onDismiss: (() => void) | undefined
	dismissable?: boolean
}

export default function AlertModal(props: Props) {
	const {
		visible = false,
		icon = { name: 'information', size: 36, color: 'white' },
		iconStyle = { backgroundColor: 'darkblue' },
		onDismiss,
		dismissable = true,
		children
	} = props

	return (
		<>
			<Portal>
				<Modal
					dismissable={dismissable}
					visible={visible}
					onDismiss={onDismiss}
					contentContainerStyle={tw.style(`bg-white p-4 m-4 rounded-lg`)}
				>
					<View
						style={tw.style(`rounded-full p-2 border-4 border-white`, {
							position: 'absolute',
							alignSelf: 'center',
							top: -(icon.size / 2),
							marginBottom: 50,
							backgroundColor: iconStyle.backgroundColor || tw.color('red-400')
						})}
					>
						<MaterialCommunityIcons name={icon.name} size={icon.size} color={icon.color} />
					</View>

					<View style={tw.style(`p-2 pb-4`, { top: icon.size / 2 })}>{children}</View>
				</Modal>
			</Portal>
		</>
	)
}
