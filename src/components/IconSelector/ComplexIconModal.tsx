import { Modal, Portal, Text, IconButton, Button } from 'react-native-paper'
import tw from '@src/libs/tailwind'

import { Image, TouchableOpacity, View } from 'react-native'
import { ScrollView } from 'react-native'
import { GenericIcons, BrandIcons } from '@src/common/assets/icons'
import { i18n } from '@src/app/locale'

type Props = {
	visible: boolean
	hideModal: () => void
	onChange: (icon?: OPM.ComplexIcon) => void
}

export default function ComplexIconModal(props: Props) {
	const { visible, hideModal, onChange } = props

	return (
		<Portal>
			<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={tw.style(`bg-white p-4 m-4`)}>
				<View style={tw`absolute items-end pb-2 top-[-4] right-[-3]`}>
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
						{GenericIcons.map((ic: OPM.GenericIcon, index: number) => {
							return (
								<TouchableOpacity
									key={`ic-${index}-${ic.id}`}
									onPress={() => onChange(ic)}
									style={tw`w-1/4 p-1 justify-center items-center`}
								>
									<IconButton icon={ic.name} size={45} iconColor={ic.color} style={tw`p-0 m-0`} />
									<Text style={tw`text-center mt-[-8]`}>{ic.displayName}</Text>
								</TouchableOpacity>
							)
						})}
					</View>

					<Text style={tw`font-bold text-lg`}>{i18n.t('component:icon-initial:icons-selector:text:brand-icons')}</Text>
					<View style={tw`flex flex-row flex-wrap w-full`}>
						{BrandIcons.map((ic: OPM.BrandIcon, index: number) => {
							return (
								<TouchableOpacity
									key={`ic-${index}-${ic.id}`}
									onPress={() => onChange(ic)}
									style={tw.style(`w-1/4 p-1 py-2 justify-center items-center`)}
								>
									<Image resizeMode="contain" source={ic.path} style={tw.style({ height: 40, width: 40 })} />
									<Text style={tw`text-center`}>{ic.displayName}</Text>
								</TouchableOpacity>
							)
						})}
					</View>
				</ScrollView>

				{/* Footer */}
				<View style={tw`pt-2 flex-auto flex-row`}>
					<Button mode="contained-tonal" style={tw`flex-1 mx-1`} onPress={hideModal}>
						{i18n.t('button:label:cancel')}
					</Button>
					<Button mode="contained" style={tw`flex-1 mx-1`} onPress={() => onChange()}>
						{i18n.t('button:label:remove')}
					</Button>
				</View>
			</Modal>
		</Portal>
	)
}
