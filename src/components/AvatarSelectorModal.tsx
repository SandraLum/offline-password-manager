import { useMemo, useState } from 'react'
import { TouchableOpacity, View, ViewStyle } from 'react-native'
import { Modal, Portal, Text, IconButton, Button, Divider } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import tw from 'twrnc'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { i18n } from '@src/app/locale'
import { BasicIcons } from '@src/common/assets/icons'
import Avatar from './Avatar'

type Props = {
	icon: OPM.Avatar
	visible: boolean
	hideModal: () => void
	onChange: (icon: OPM.Avatar) => void
}

type ThemeColor = {
	id: string
	color: string | undefined
	backgroundColor: string | undefined
}

type CurrentIcon = OPM.Avatar & { themeId?: string }

const ThemeColor = (props: ThemeColor) => {
	const { color = 'white', backgroundColor = tw.color('green-400') } = props
	return (
		<>
			<View
				style={tw.style({
					height: 40,
					width: 40,
					borderRadius: 200,
					flexDirection: 'column',
					justifyContent: 'flex-start',
					backgroundColor: backgroundColor
				})}
			>
				<View
					style={tw.style(`flex-1`, {
						margin: 1,
						height: '100%',
						width: '49%',
						borderTopLeftRadius: 200,
						borderBottomLeftRadius: 200,
						backgroundColor: color
					})}
				/>
			</View>
		</>
	)
}

export default function BasicIconModal(props: Props) {
	const { visible, icon, hideModal, onChange } = props
	const ThemeColors: ThemeColor[] = useMemo(
		() => [
			{ id: 'themecol-1', color: tw.color('zinc-700'), backgroundColor: tw.color('zinc-200') },
			{ id: 'themecol-2', color: 'white', backgroundColor: tw.color('zinc-200') },
			{ id: 'themecol-3', color: 'white', backgroundColor: tw.color('slate-400') },
			{ id: 'themecol-4', color: 'white', backgroundColor: tw.color('stone-400') },
			{ id: 'themecol-5', color: tw.color('gray-400'), backgroundColor: tw.color('gray-600') },
			{ id: 'themecol-6', color: tw.color('gray-500'), backgroundColor: tw.color('gray-900') },
			//Lighter theme
			{ id: 'themecol-7', color: 'white', backgroundColor: tw.color('orange-200') },
			{ id: 'themecol-8', color: 'white', backgroundColor: tw.color('yellow-300') },
			{ id: 'themecol-9', color: 'white', backgroundColor: tw.color('green-300') },
			{ id: 'themecol-10', color: 'white', backgroundColor: tw.color('sky-300') },
			{ id: 'themecol-11', color: 'white', backgroundColor: tw.color('violet-200') },
			{ id: 'themecol-12', color: 'white', backgroundColor: tw.color('pink-200') },
			// Lighter theme inversed
			{ id: 'themecol-13', color: tw.color('orange-300'), backgroundColor: tw.color('orange-100') },
			{ id: 'themecol-14', color: tw.color('yellow-400'), backgroundColor: tw.color('yellow-100') },
			{ id: 'themecol-15', color: tw.color('green-400'), backgroundColor: tw.color('green-100') },
			{ id: 'themecol-16', color: tw.color('sky-400'), backgroundColor: tw.color('sky-100') },
			{ id: 'themecol-17', color: tw.color('violet-400'), backgroundColor: tw.color('violet-100') },
			{ id: 'themecol-18', color: tw.color('pink-400'), backgroundColor: tw.color('pink-100') },

			// Darker theme
			{ id: 'themecol-19', color: tw.color('orange-100'), backgroundColor: tw.color('orange-500') },
			{ id: 'themecol-20', color: tw.color('amber-200'), backgroundColor: tw.color('amber-500') },
			{ id: 'themecol-21', color: tw.color('green-200'), backgroundColor: tw.color('emerald-500') },
			{ id: 'themecol-22', color: tw.color('sky-200'), backgroundColor: tw.color('cyan-600') },
			{ id: 'themecol-23', color: tw.color('violet-200'), backgroundColor: tw.color('purple-600') },
			{ id: 'themecol-24', color: tw.color('pink-200'), backgroundColor: tw.color('pink-600') }
		],
		[]
	)

	const [currentIcon, setCurrentIcon] = useState<CurrentIcon>((): CurrentIcon => {
		const themeColor: ThemeColor | undefined = ThemeColors.find(
			t => t.color === icon.color && t.backgroundColor === (icon.style as ViewStyle)?.backgroundColor
		)
		return { ...icon, themeId: themeColor?.id }
	})

	function onIconSelected(icon: OPM.Avatar) {
		setCurrentIcon(o => ({ ...o, name: icon.name }))
	}

	function onThemeColorSelected(selectedtheme: ThemeColor) {
		const theme = {
			themeId: selectedtheme.id,
			color: selectedtheme.color,
			style: { backgroundColor: selectedtheme.backgroundColor }
		}
		setCurrentIcon(o => ({ ...o, ...theme }))
	}
	return (
		<>
			<Portal>
				<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={tw.style(`flex-1 bg-white m-4`)}>
					<View style={tw`absolute items-end pb-2 top-[-5] right-[-3]  z-50`}>
						<IconButton
							mode="contained-tonal"
							icon="close"
							size={18}
							iconColor={tw.color('slate-900')}
							style={tw`p-0 m-0`}
							onPress={hideModal}
						/>
					</View>

					<View style={tw`p-2 bg-gray-100`}>
						<Text>{i18n.t('component:basic-icon-modal:text:custom-icon')}</Text>
					</View>

					{/* Current Icon */}
					{currentIcon && (
						<View style={tw.style(`flex flex-row justify-center p-3`)}>
							<Avatar icon={currentIcon} size={42} style={tw.style(currentIcon.style as ViewStyle)} />
						</View>
					)}
					<Divider bold />

					<ScrollView contentContainerStyle={tw`px-3 pt-1 pb-2`}>
						<Text style={tw`font-bold text-lg text-gray-500 mb-1`}>
							{i18n.t('component:basic-icon-modal:text:icons')}
						</Text>

						<View style={tw`flex flex-row flex-wrap w-full pb-1 justify-between`}>
							{BasicIcons.map((ic: OPM.BasicIcon, index: number) => {
								return (
									<TouchableOpacity
										key={`bc-${index}-${ic.name}`}
										onPress={() => onIconSelected(ic)}
										style={tw.style(
											`border-transparent rounded-full`,
											{ height: 56, width: 56, borderWidth: 3 },
											ic.name === currentIcon?.name ? ` border-yellow-400` : ``
										)}
									>
										<MaterialCommunityIcons
											name={ic.name}
											size={32}
											color={tw.color('zinc-600')}
											style={tw.style(`p-1 m-1 rounded-full bg-transparent border-zinc-400`, {
												borderWidth: 1,
												textAlign: 'center',
												verticalAlign: 'middle'
											})}
										/>
									</TouchableOpacity>
								)
							})}
						</View>
						<Divider />

						<Text style={tw`font-bold text-lg text-gray-500 my-1`}>
							{i18n.t('component:basic-icon-modal:text:color-theme')}
						</Text>

						<View style={tw`flex-row flex-wrap w-full justify-between`}>
							{ThemeColors.map((themeColor, index) => (
								<TouchableOpacity
									key={`theme-col-${index}`}
									onPress={() => onThemeColorSelected(themeColor)}
									style={tw.style(
										`border-transparent rounded-full justify-center items-center`,
										{ height: 54, width: 54, borderWidth: 3 },
										themeColor.id === currentIcon.themeId ? ` border-yellow-400` : ``
									)}
								>
									<ThemeColor {...themeColor} />
								</TouchableOpacity>
							))}
						</View>
					</ScrollView>

					{/* Footer */}
					<View style={tw`pt-2 flex flex-row p-3`}>
						<Button mode="contained-tonal" style={tw`flex-1 mx-1`} onPress={hideModal}>
							{i18n.t('button:label:cancel')}
						</Button>
						<Button mode="contained" style={tw`flex-1 mx-1`} onPress={() => onChange(currentIcon as OPM.Avatar)}>
							{i18n.t('button:label:apply')}
						</Button>
					</View>
				</Modal>
			</Portal>
		</>
	)
}
