import { View, Keyboard, Text } from 'react-native'
import tw from '@src/libs/tailwind'
import { i18n } from '@src/app/locale'
import { IconButton, TextInput as PaperTextInput } from 'react-native-paper'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { OPMTypes } from '@src/common/types'
import { EntryMode } from '@src/common/enums'
import IconSelector from '@src/components/IconSelector'

type Props = {
	category: OPMTypes.Category
	entry: {
		title: OPM.EntryTitle
		favourite: OPMTypes.Entry['favourite']
	}
	mode?: EntryMode
	onDelete?: () => void
	onUpdate?: () => void
	onCancel: () => void
	setMode?: (mode: EntryMode) => void
	onChangeFavourite: () => void
	setTitle: React.Dispatch<React.SetStateAction<OPM.EntryTitle>>
	onChangeIcon: (icon?: OPM.ComplexIcon) => void
}

export default function Header(props: Props) {
	const {
		category,
		mode = EntryMode.READ,
		entry: { title, favourite },
		setTitle,
		onChangeFavourite,
		setMode,
		onDelete,
		onChangeIcon
	} = props
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase> | NativeStackNavigationProp<ParamListBase>>()
	const editable = mode !== EntryMode.READ

	function navigateBack() {
		Keyboard.dismiss()
		navigation.goBack()
	}

	function renderButtons(mode: EntryMode) {
		let headerButtons
		switch (mode) {
			case EntryMode.READ:
				headerButtons = (
					<>
						<IconButton
							icon={favourite ? 'star' : 'star-outline'}
							style={tw`m-0`}
							onPress={onChangeFavourite}
							iconColor={favourite ? 'yellow' : 'black'}
						/>
						<IconButton icon="pencil" style={tw`m-0`} onPress={() => setMode?.(EntryMode.EDIT)} />
						<IconButton icon="delete" style={tw`m-0`} onPress={onDelete} />
					</>
				)
				break
			case EntryMode.NEW:
			case EntryMode.EDIT:
				headerButtons = (
					<>
						<IconButton
							icon="star-outline"
							style={tw`m-1`}
							onPress={onChangeFavourite}
							iconColor={favourite ? 'yellow' : 'white'}
						/>
						<IconButton icon="content-save" style={tw`m-1`} onPress={props.onUpdate} iconColor="white" />
						<IconButton icon="close" style={tw`m-1`} iconColor={tw.color('neutral-700')} onPress={props.onCancel} />
					</>
				)
				break
		}
		return headerButtons
	}

	return (
		<View style={tw.style(`bg-[#0fdbc4] rounded-bl-3xl rounded-br-3xl`, { overflow: 'hidden' })}>
			<SafeAreaView>
				{/* Design */}
				<View
					style={tw.style(`bg-white absolute rounded-full opacity-30`, {
						top: '65%',
						left: '20%',
						width: 170,
						height: 150,
						transform: [{ scaleX: 3 }, { rotate: '20deg' }]
					})}
				/>

				{/* Buttons */}
				<View style={tw`flex flex-row`}>
					<View style={tw.style(`self-start`, { transform: [{ rotate: '-90deg' }] })}>
						<IconButton style={tw`mx-0`} icon="dots-triangle" iconColor={tw.color('white')} onPress={navigateBack} />
					</View>
					<View style={tw`flex flex-1 flex-row pb-2 items-center`}>
						{!editable ? (
							<>
								<IconSelector
									bordered={editable}
									editable={editable}
									size={36}
									icon={title.icon}
									name={title.name}
									containerStyle={tw`bg-white mt-2`}
									onChangeIcon={onChangeIcon}
								/>
								<View style={tw`flex-col`}>
									<Text style={tw.style(`pt-3 text-3 font-bold text-neutral-600`)}>{category.name}</Text>
									<Text style={tw`text-white text-5 font-bold`} numberOfLines={2} ellipsizeMode="tail">
										{title.name}
									</Text>
								</View>
							</>
						) : (
							<Text style={tw.style(`pt-2 text-4 font-bold text-neutral-600`)}>{category.name}</Text>
						)}
					</View>
					<View style={tw.style(`flex-row pt-1 grow-0`)}>{renderButtons(mode)}</View>
				</View>

				{/* Title */}
				{editable && (
					<View style={tw`flex flex-row px-4 justify-center items-center top-[-2] pb-2`}>
						<IconSelector
							bordered={editable}
							editable={editable}
							size={40}
							icon={title.icon}
							name={title.name}
							containerStyle={tw`bg-white`}
							onChangeIcon={onChangeIcon}
						/>
						<PaperTextInput
							dense
							mode="outlined"
							editable={editable}
							value={title.name}
							onChangeText={text => setTitle({ ...title, name: text })}
							style={tw.style(`flex flex-1 text-4`)}
							textColor={!editable ? tw.color('neutral-100') : tw.color('neutral-600')}
							outlineStyle={tw.style(`rounded-lg`)}
							error={title.name.trim() === ''}
							underlineColor="transparent"
							activeUnderlineColor="transparent"
							placeholder={i18n.t('entry:form:field:input:placeholder:title')}
							focusable={true}
							right={
								editable && title.name.length > 0 ? (
									<PaperTextInput.Icon
										icon="close-circle-outline"
										iconColor={tw.color('neutral-600')}
										forceTextInputFocus={true}
										onPress={() => setTitle({ ...title, name: '' })}
									/>
								) : null
							}
						/>
					</View>
				)}
			</SafeAreaView>
		</View>
	)
}
