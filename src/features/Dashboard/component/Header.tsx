import { useState } from 'react'
import { View, TextInput, Keyboard } from 'react-native'
import ProfileMenu from './ProfileMenu'
import tw from '@src/libs/tailwind'
import { i18n } from '@src/app/locale'
import { IconButton } from 'react-native-paper'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MaterialIcons } from '@expo/vector-icons'

type Props = {
	onSearchChange: (query: string) => void
	onBackPress: () => void
	showDrawerIcon: boolean
}

export default function Header(props: Props) {
	const { showDrawerIcon } = props
	const navigation = useNavigation<DrawerNavigationProp<ParamListBase> | NativeStackNavigationProp<ParamListBase>>()
	const [searchQuery, setSearchQuery] = useState<string>('')
	const bgDesign = { size: 600 }

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
		<View style={tw`py-2 bg-aqua-500 rounded-bl-3xl rounded-br-3xl`}>
			{/* Design */}
			<View
				style={tw.style(`bg-white absolute rounded-full opacity-30`, {
					backgroundColor: tw.color('amber-200'),
					top: '50%',
					left: '-60%',
					width: bgDesign.size,
					height: bgDesign.size,
					transform: [{ scaleX: 1.6 }]
				})}
			/>

			<SafeAreaView style={tw``}>
				<View style={tw`flex flex-row items-center justify-between`}>
					{showDrawerIcon ? (
						<IconButton
							icon="dots-grid"
							iconColor="white"
							size={30}
							onPress={(navigation as DrawerNavigationProp<ParamListBase>).toggleDrawer}
						/>
					) : (
						<View style={{ transform: [{ rotate: '-90deg' }] }}>
							<IconButton icon="dots-triangle" iconColor={tw.color('white')} size={30} onPress={navigateBack} />
						</View>
					)}
					<ProfileMenu />
				</View>
				<View style={tw`flex flex-row p-3`}>
					{/* Search bar */}
					<View style={tw`flex-1 flex-row rounded-lg px-2 py-[6px] ml-1 mr-3 items-center bg-white`}>
						<MaterialIcons name={'search'} size={20} color={tw.color('neutral-400')} />

						<TextInput
							style={tw`flex-1 text-base`}
							placeholderTextColor={tw.color('neutral-500')}
							placeholder={i18n.t('search:bar:placeholder:search')}
							onChangeText={onChangeSearch}
							inlineImageLeft="search-icon"
							value={searchQuery}
							onBlur={Keyboard.dismiss}
						/>
						{searchQuery.length !== 0 ? (
							<IconButton icon="close" size={15} style={tw`bg-neutral-300 m-0 p-1`} onPress={clearQuery} />
						) : null}
					</View>
				</View>
			</SafeAreaView>
		</View>
	)
}
