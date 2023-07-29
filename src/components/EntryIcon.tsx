import { Image, TouchableOpacity, ViewStyle } from 'react-native'
import { Badge, Avatar } from 'react-native-paper'
import tw from 'twrnc'

import { getInitials } from '@utils'

type EntryIcon = {
	icon: OPM.ComplexIcon | undefined
	name: string | undefined
	size: number | undefined
	OnPress?: () => void
	bordered?: boolean
	editable?: boolean
	dense?: boolean
	style?: ViewStyle
}

export default function EntryIcon(props: EntryIcon) {
	const { icon, name, OnPress, size = 36, bordered = false, editable = false, dense = false, style } = props
	const roundedBorderStyle = 'border rounded-full border-slate-300'
	const reducedSize = dense ? 0.8 : 1
	let iconType: 'badge' | 'brand' | 'generic'
	let renderIcon = null

	if (!icon) {
		return null
	} else if (icon.id && (icon as OPM.BrandIcon).path) {
		iconType = 'brand'
	} else if (icon.id && (icon as OPM.GenericIcon).name) {
		iconType = 'generic'
	} else {
		iconType = 'badge'
	}

	switch (iconType) {
		case 'badge': {
			const badgeIcon: OPM.BadgeIcon = icon as OPM.BadgeIcon
			renderIcon = (
				<TouchableOpacity activeOpacity={0.5} disabled={!editable} onPress={OnPress}>
					<Badge
						size={(size + 2) * reducedSize}
						style={tw.style(
							`bg-transparent`,
							{
								color: badgeIcon.color,
								fontFamily: 'sans-serif-medium',
								fontSize: size * 0.55 * reducedSize
							},
							roundedBorderStyle,
							dense ? 'mx-1' : '',
							style
						)}
					>
						{getInitials(name)}
					</Badge>
				</TouchableOpacity>
			)
			break
		}
		case 'generic': {
			const genericIcon: OPM.GenericIcon = icon as OPM.GenericIcon
			renderIcon = (
				<TouchableOpacity activeOpacity={0.5} disabled={!editable} onPress={OnPress}>
					<Avatar.Icon
						icon={genericIcon.name}
						size={size + 4}
						color={genericIcon.color}
						style={tw.style({ backgroundColor: 'transparent' }, bordered && roundedBorderStyle, style)}
					/>
				</TouchableOpacity>
			)
			break
		}
		case 'brand': {
			const brandIcon: OPM.BrandIcon = icon as OPM.BrandIcon
			renderIcon = (
				<TouchableOpacity
					disabled={!editable}
					onPress={OnPress}
					activeOpacity={0.5}
					style={tw.style(
						`justify-center items-center`,
						{ width: size + 2, height: size + 2 },
						bordered && roundedBorderStyle
					)}
				>
					<Image
						resizeMode="contain"
						source={brandIcon.path}
						style={tw.style({ width: size * 0.8, height: size * 0.8 }, style)}
					/>
				</TouchableOpacity>
			)
			break
		}
	}

	return renderIcon
}
