import { useState } from 'react'
import { IconButton } from 'react-native-paper'
import tw from 'twrnc'
import { View } from 'react-native'

import ComplexIconModal from './ComplexIconModal'
import EntryIcon from '../EntryIcon'

type Props = {
	icon: OPM.ComplexIcon | undefined
	size: number
	editable: boolean
	bordered?: boolean
	name?: string
	style?: unknown
	onChangeIcon: (icon?: OPM.ComplexIcon) => void
}

export default function IconSelector(props: Props) {
	const { editable, icon, name } = props
	const [visible, setVisible] = useState(false)
	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)

	function onChangeIcon(icon?: OPM.ComplexIcon) {
		if (props.onChangeIcon) {
			props.onChangeIcon(icon)
			hideModal()
		}
	}

	return (
		<>
			<View style={tw`flex flex-row`}>
				{/* <IconInitialsBadge {...props} onIconPress={() => editable && showModal()} /> */}
				<EntryIcon
					name={name}
					editable={editable}
					bordered={true}
					OnPress={() => editable && showModal()}
					icon={icon}
					size={42}
					// style={tw`ml-1`}
				/>

				{editable && (
					<>
						<IconButton
							icon="pencil"
							size={14}
							style={tw.style(`bg-white border border-slate-400 absolute right-0 top-[-2]`, {
								width: 20,
								height: 20
							})}
							onPress={showModal}
						/>
						<View style={tw`p-2`} />
					</>
				)}
			</View>

			{/* Modal icons selector ------------------- */}
			{editable && <ComplexIconModal visible={visible} hideModal={hideModal} onChange={onChangeIcon} />}

			<View style={tw.style(!editable && `mr-1`)} />
		</>
	)
}
