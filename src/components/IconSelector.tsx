/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { Modal, Portal, Text, IconButton, Button } from 'react-native-paper'
import tw from 'twrnc'

import { Image, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { GenericIcons, BrandIcons } from '@src/common/assets/icons'
import IconInitialsBadge from './IconInitialsBadge'

import { i18n } from '@src/app/locale'

export default function IconSelector(props: any) {
	const { editable } = props
	const [visible, setVisible] = useState(false)
	const showModal = () => setVisible(true)
	const hideModal = () => setVisible(false)

	function onIconSelect(icon: any) {
		if (props.onChangeIcon) {
			props.onChangeIcon(icon)
			hideModal()
		}
	}

	function onIconPress() {
		if (editable) {
			showModal()
		}
	}

	return (
		<>
			<View style={tw`flex flex-row`}>
				<IconInitialsBadge {...props} onIconPress={onIconPress} />

				{editable && (
					<>
						<IconButton
							icon="pencil"
							size={14}
							style={tw.style(`bg-white border border-slate-400 absolute right-0 top-[-2]`, {
								width: 20,
								height: 20
							})}
							onPress={() => editable && showModal()}
						/>
						<View style={tw`p-2`} />
					</>
				)}
			</View>

			{/* Modal icons selector ------------------- */}
			{editable && (
				<>
					<Portal>
						<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={tw.style(`bg-white p-2 m-4`)}>
							<View style={tw`absolute items-end pb-2 top-[-5] right-[-3]`}>
								<IconButton
									mode="contained-tonal"
									icon="close"
									size={18}
									iconColor={tw.color('slate-900')}
									style={tw`p-0 m-0`}
									onPress={hideModal}
								/>
							</View>
							<ScrollView>
								<Text style={tw`font-bold text-lg`}>
									{i18n.t('component:icon-initial:icons-selector:text:generic-icons')}
								</Text>

								<View style={tw`flex flex-row flex-wrap w-full pb-5`}>
									{GenericIcons.map((ic: any, index: number) => {
										return (
											<View key={`ic-${index}-${ic.name}`} style={tw`w-1/4`}>
												<TouchableOpacity onPress={() => onIconSelect(ic)} style={tw`p-2 justify-center items-center`}>
													<IconButton icon={ic.name} size={45} iconColor={ic.color} style={tw`p-0 m-0`} />
													<Text style={tw`text-center mt-[-8]`}>{ic.displayName}</Text>
												</TouchableOpacity>
											</View>
										)
									})}
								</View>

								<Text style={tw`font-bold text-lg`}>
									{i18n.t('component:icon-initial:icons-selector:text:brand-icons')}
								</Text>
								<View style={tw`flex flex-row flex-wrap w-full`}>
									{BrandIcons.map((ic: any, index: number) => {
										return (
											<View key={`ic-${index}-${ic.name}`} style={tw.style(`w-1/4`)}>
												<TouchableOpacity
													onPress={() => onIconSelect(ic)}
													style={tw.style(`p-2 justify-center items-center`)}
												>
													<Image resizeMode="contain" source={ic.path} style={tw.style({ height: 40, width: 40 })} />
													<Text style={tw`text-center`}>{ic.displayName}</Text>
												</TouchableOpacity>
											</View>
										)
									})}
								</View>
							</ScrollView>

							{/* Footer */}
							<View style={tw`pt-2 flex-auto flex-row`}>
								<Button mode="contained-tonal" style={tw`flex-1 mx-1`} onPress={hideModal}>
									{'Cancel'}
								</Button>
								<Button mode="contained" style={tw`flex-1 mx-1`} onPress={() => onIconSelect({})}>
									Remove
								</Button>
							</View>
						</Modal>
					</Portal>
				</>
			)}

			<View style={tw.style(!editable && `mr-1`)} />
		</>
	)
}
