import { View, ScrollView } from 'react-native'
import { Text, Divider, TextInput as PaperTextInput } from 'react-native-paper'

import tw from 'twrnc'
import IconSelector from '@components/IconSelector'
import { OPMTypes } from '@src/common/types'

type Props = {
	editable: boolean
	profile: OPMTypes.Profile | OPMTypes.EmptyProfile
	setProfile: React.Dispatch<React.SetStateAction<OPMTypes.Profile | OPMTypes.EmptyProfile>>
}

export default function ProfileForm(props: Props) {
	const { profile, editable, setProfile } = props
	if (!profile) return null

	const { avatar, name, description } = profile
	const bgDesign = { size: 400 }

	function setName(val: string) {
		setProfile(o => ({ ...o, name: val }))
	}
	function setDescription(val: string) {
		setProfile(o => ({ ...o, description: val }))
	}

	function onChangeIcon() {
		// SL TODO: update avatar
	}

	return (
		<ScrollView
			nestedScrollEnabled={true}
			showsVerticalScrollIndicator={true}
			style={tw`bg-white`}
			contentContainerStyle={tw.style(`flex h-full`)}
		>
			<View style={tw.style(`w-full py-0 h-full`, { overflow: 'hidden' })}>
				<View style={tw.style(`h-1/4 flex-col items-center justify-center bg-teal-200`, { overflow: 'hidden' })}>
					{/* Design */}
					<>
						<View
							style={tw.style(`bg-teal-600 absolute rounded-full opacity-70`, {
								top: '50%',
								left: '-20%',
								width: bgDesign.size / 2,
								height: bgDesign.size / 2
							})}
						/>
						<View
							style={tw.style(`bg-white absolute rounded-full opacity-50`, {
								top: '20%',
								left: '70%',
								width: bgDesign.size,
								height: bgDesign.size,
								transform: [{ scaleX: 3 }]
							})}
						/>
					</>

					<IconSelector
						editable={editable}
						size={58}
						icon={avatar.icon}
						onChangeIcon={onChangeIcon}
						style={avatar.iconStyle}
					/>
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
							// multiline={true}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	)
}
