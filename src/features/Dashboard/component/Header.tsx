import { useState } from 'react'
import { View, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import ProfileMenu from './ProfileMenu'
import tw from 'twrnc'
import { i18n } from '@src/app/locale'
import { IconButton } from 'react-native-paper'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type Props = {
	onSearchChange: (query: string) => void
	onBackPress: () => void
	showDrawerIcon: boolean
}

export default function Header(props: Props) {
	const { showDrawerIcon } = props
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase> | NativeStackNavigationProp<ParamListBase>>()
	const [searchQuery, setSearchQuery] = useState<string>('')

	function onChangeSearch(query: string) {
		setSearchQuery(query)
		props.onSearchChange(query)
	}

	function clearQuery() {
		onChangeSearch('')
	}

	function navigateBack() {
		onChangeSearch('')
		Keyboard.dismiss()
		props.onBackPress()
	}

	return (
		<SafeAreaView style={tw`bg-white`}>
			<View style={tw`flex flex-row items-center`}>
				{showDrawerIcon ? (
					<IconButton
						icon="menu"
						size={26}
						style={tw`bg-transparent`}
						onPress={(navigation as DrawerNavigationProp<ParamListBase>).toggleDrawer}
					/>
				) : (
					<IconButton icon="chevron-left" size={26} style={tw`bg-transparent`} onPress={navigateBack} />
				)}

				{/* Search bar */}
				<View style={tw`flex-1 flex-row border-orange-500 border-[1px] rounded-xl p-2 ml-1 my-2 mr-3 items-center`}>
					<TextInput
						style={tw`flex-1 text-base`}
						placeholderTextColor={tw.color('orange-500')}
						placeholder={i18n.t('search:bar:placeholder:search')}
						onChangeText={onChangeSearch}
						value={searchQuery}
						onBlur={Keyboard.dismiss}
					/>
					{searchQuery.length !== 0 ? (
						<IconButton icon="close" size={15} style={tw`bg-neutral-300 m-0 p-1`} onPress={clearQuery} />
					) : null}
				</View>

				<ProfileMenu />
			</View>
		</SafeAreaView>
	)
}
