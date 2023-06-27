import { useState } from 'react'
import { IconButton } from 'react-native-paper'
import tw from 'twrnc'
import { View, TouchableOpacity } from 'react-native'

import Avatar from './Avatar'
import AvatarSelectorModal from './AvatarSelectorModal'

type Props = {
	icon: OPM.Avatar
	size: number
	editable: boolean
	style?: unknown
	onChangeIcon: (icon: OPM.Avatar) => void
}

export default function IconSelector(props: Props) {
	const { editable, size, icon } = props
	const [visible, setVisible] = useState(false)
	const [currentIcon, setCurrentIcon] = useState<OPM.Avatar>(icon)
	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)

	function onChangeIcon(icon: OPM.Avatar) {
		props.onChangeIcon(icon)
		setCurrentIcon(icon)
		hideModal()
	}

	return (
		<>
			<View style={tw`flex flex-row`}>
				<TouchableOpacity onPress={showModal}>
					<Avatar icon={currentIcon} size={size} />
				</TouchableOpacity>

				{editable && (
					<>
						<IconButton
							icon="pencil"
							size={16}
							style={tw.style(`bg-white border border-slate-400 absolute right-0 top-[-2]`, {
								width: 24,
								height: 24
							})}
							onPress={showModal}
						/>
						<View style={tw`p-2`} />
					</>
				)}
			</View>

			<AvatarSelectorModal icon={icon as OPM.Avatar} visible={visible} hideModal={hideModal} onChange={onChangeIcon} />
		</>
	)
}
