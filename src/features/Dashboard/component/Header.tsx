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
		<>
			{/* Design */}
			<View
				style={tw.style(`bg-white absolute rounded-full opacity-50`, {
					backgroundColor: tw.color('amber-200'),
					top: '15%',
					left: '-50%',
					width: bgDesign.size + 100,
					height: bgDesign.size,
					transform: [{ scaleX: 1.9 }, { rotate: '-35deg' }]
				})}
			/>
			<View style={tw.style(`py-2 rounded-bl-3xl rounded-br-3xl z-1`, { backgroundColor: 'rgba(15, 219, 196, 0.6)' })}>
				<SafeAreaView>
					<View style={tw`flex flex-row items-center justify-between bg-transparent`}>
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
		</>
	)
}
