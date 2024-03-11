import { Badge, Avatar } from 'react-native-paper'
import tw from '@src/libs/tailwind'

import { Image, TouchableOpacity } from 'react-native'

import * as utils from '@utils'

export default function IconInitialsBadge({
	icon,
	name,
	size = 36,
	bordered = false,
	editable = false,
	dense = false,
	...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) {
	const roundedBorderStyle = 'border rounded-full border-slate-300'
	const reducedSize = dense ? 0.8 : 1
	let iconType = 'badge'
	let renderIcon = null

	if (!icon) return null

	function onIconPress() {
		if (props.onIconPress) {
			props.onIconPress()
		}
	}

	if (icon.id) {
		iconType = icon.path ? 'image' : 'icon'
	} else if (!icon.id && icon.name) {
		iconType = 'icon'
	}

	switch (iconType) {
		case 'badge':
			renderIcon = (
				<TouchableOpacity disabled={!editable} onPress={onIconPress}>
					<Badge
						size={(size + 2) * reducedSize}
						onPress={onIconPress}
						style={tw.style(
							`bg-transparent`,
							{
								color: icon.bgColor,
								fontFamily: 'sans-serif-medium',
								fontSize: size * 0.55 * reducedSize
							},
							roundedBorderStyle,
							dense ? 'mx-1' : ''
						)}
					>
						{utils.getInitials(name)}
					</Badge>
				</TouchableOpacity>
			)
			break
		case 'icon':
			renderIcon = (
				<TouchableOpacity disabled={!editable} onPress={onIconPress}>
					<Avatar.Icon
						icon={icon.name}
						size={size + 2}
						color={icon.color}
						style={tw.style(
							{ backgroundColor: icon.bgColor || 'transparent' },
							!icon.bgColor && bordered && roundedBorderStyle,
							props.style
						)}
					/>
				</TouchableOpacity>
			)
			break
		case 'image':
			renderIcon = (
				<TouchableOpacity
					disabled={!editable}
					onPress={onIconPress}
					style={tw.style(
						`justify-center items-center`,
						{ width: size + 2, height: size + 2 },
						bordered && roundedBorderStyle
					)}
				>
					<Image resizeMode="contain" source={icon.path} style={tw.style({ width: size * 0.8, height: size * 0.8 })} />
				</TouchableOpacity>
			)
			break
	}

	return renderIcon
}
