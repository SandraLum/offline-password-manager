import { TextStyle, ViewStyle } from 'react-native/types'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import tw from '@src/libs/tailwind'

type Props = {
	icon: OPM.Avatar
	size: number
	style?: TextStyle | ViewStyle
}

const defaultIcon: OPM.Avatar = {
	name: 'account',
	color: 'black',
	style: { backgroundColor: tw.color('zinc-200') } as ViewStyle
}

export default function Avatar(props: Props) {
	const { icon = defaultIcon, size = 32, style } = props
	const widthHeight = size * 1.4

	return (
		<MaterialCommunityIcons
			name={icon.name}
			size={size}
			color={icon.color}
			style={tw.style(
				`rounded-full text-center`,
				{ height: widthHeight, width: widthHeight, verticalAlign: 'middle' },
				icon.style as ViewStyle,
				style as ViewStyle
			)}
		/>
	)
}
