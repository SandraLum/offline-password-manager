import { View, ScrollView, ViewStyle } from 'react-native'
import { Text, Divider, TextInput as PaperTextInput } from 'react-native-paper'

import tw from '@src/libs/tailwind'
import { OPMTypes } from '@src/common/types'
import AvatarCustomizer from '@src/components/AvatarCustomizer'

type Props = {
	editable: boolean
	profile: OPMTypes.Profile | OPMTypes.EmptyProfile
	setProfile: React.Dispatch<React.SetStateAction<OPMTypes.Profile | OPMTypes.EmptyProfile>>
}

export default function ProfileForm(props: Props) {
	const { profile, editable, setProfile } = props
	const color = profile?.avatar?.color
	const backgroundColor = (profile?.avatar?.style as ViewStyle)?.backgroundColor || 'bg-teal-200'

	if (!profile) return null

	const { avatar, name, description } = profile
	const bgDesign = { size: 400 }

	function setName(val: string) {
		setProfile(o => ({ ...o, name: val }))
	}
	function setDescription(val: string) {
		setProfile(o => ({ ...o, description: val }))
	}

	function onChangeIcon(icon: OPM.Avatar) {
		setProfile(o => ({ ...o, avatar: icon }))
	}

	return (
		<ScrollView
			nestedScrollEnabled={true}
			showsVerticalScrollIndicator={true}
			style={tw`bg-white`}
			contentContainerStyle={tw.style(`flex-1`)}
		>
			<View>
				<View
					style={tw.style(`py-6 flex-col items-center justify-center`, { backgroundColor: color, overflow: 'hidden' })}
				>
					{/* Design */}
					<View
						style={tw.style(`bg-white absolute rounded-full opacity-40`, {
							backgroundColor: backgroundColor,
							top: '30%',
							left: '-70%',
							width: bgDesign.size,
							height: bgDesign.size,
							transform: [{ scaleX: 3 }]
						})}
					/>

					<AvatarCustomizer editable={editable} size={58} icon={avatar} onChangeIcon={onChangeIcon} />
				</View>

				<Divider style={tw.style({ borderBottomWidth: 1, borderColor: tw.color('teal-300') })} />

				{/* Render fields */}
				<View style={tw.style(`flex p-3 bg-white`)}>
					<View style={tw.style(`flex flex-row items-center py-2`)}>
						<Text style={tw.style(`pr-2 w-20`)}>{'Name'}</Text>
						<PaperTextInput
							dense
							mode={editable ? 'outlined' : 'flat'}
							editable={editable}
							value={name}
							onChangeText={setName}
							style={tw.style(`flex-1 justify-center`)}
							error={name.trim() === ''}
							underlineColor="transparent"
							placeholder="Name or Initial"
							focusable={true}
							right={
								editable && (
									<PaperTextInput.Icon
										icon="close-circle-outline"
										forceTextInputFocus={true}
										onPress={() => setName('')}
									/>
								)
							}
						/>
					</View>

					<View style={tw.style(`flex flex-row items-center  py-2`)}>
						<Text style={tw.style(`pr-2 w-20`)}>{'Profile Description'}</Text>
						<PaperTextInput
							mode={editable ? 'outlined' : 'flat'}
							editable={editable}
							value={description}
							onChangeText={setDescription}
							placeholder={'Description of profile e.g child/parent etc...'}
							style={tw.style(`flex-1 justify-center`)}
							underlineColor="transparent"
							activeUnderlineColor="hwb(360, 100%, 100%)"
							placeholderTextColor={tw.color('stone-400')}
							right={
								editable && (
									<PaperTextInput.Icon
										icon="close-circle-outline"
										forceTextInputFocus={true}
										onPress={() => setDescription('')}
									/>
								)
							}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	)
}
