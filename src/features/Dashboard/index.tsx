import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { DrawerParamList } from '@src/app/routes'
import { useEffect, useRef, useState } from 'react'
import { Dimensions, Text, View } from 'react-native'
import { Searchbar, AnimatedFAB, IconButton, Menu, Button } from 'react-native-paper'
import { useSelector } from 'react-redux'
import tw from 'twrnc'
import Categories from '../Categories'

import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { i18n } from '@src/app/locale'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { DashboardContentView, ProfileMode } from '@src/common/enums'
import { selectCurrentProfile } from '@src/store/slices/appSlice'
import ListEntries from '../Entries/ListEntries'
import Animated, {
	Easing,
	EasingNode,
	FadeIn,
	FadeInDown,
	FadeOut,
	FadeOutDown,
	LightSpeedInRight,
	ZoomIn,
	ZoomInEasyDown,
	ZoomOut,
	ZoomOutEasyDown
} from 'react-native-reanimated'

type Props = NativeStackScreenProps<DrawerParamList, 'Dashboard'>

type ContentView = {
	view: DashboardContentView
	params?: { filter: { categories: string[] } }
}

export default function Dashboard() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const profile = useSelector(selectCurrentProfile)

	const [displayView, setDisplayView] = useState<ContentView>({ view: DashboardContentView.Categories })
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [menuVisibility, setMenuVisibility] = useState<boolean>(false)

	useEffect(() => {
		function onProfileNavigate() {
			setMenuVisibility(false)

			if (profile?.id) {
				navigation.navigate({
					name: 'ViewAndEditProfile',
					params: {
						data: { profile: { id: profile.id } },
						mode: ProfileMode.EDIT
					}
				})
			}
		}

		navigation.setOptions({
			headerRight: () => (
				<Menu
					visible={menuVisibility}
					onDismiss={() => setMenuVisibility(false)}
					contentStyle={tw`bg-white`}
					style={tw`w-3/4`}
					anchor={
						<TouchableOpacity
							style={tw`flex-row items-center justify-center`}
							activeOpacity={1}
							onPress={() => setMenuVisibility(true)}
						>
							<MaterialCommunityIcons
								name="account"
								size={28}
								color={tw.color('white')}
								style={tw.style(`rounded-full shadow-md bg-red-400 p-1`)}
							/>
							<IconButton icon="dots-vertical" style={tw`m-0`} />
						</TouchableOpacity>
					}
					anchorPosition="bottom"
				>
					{/* Menu Header */}
					<View style={tw.style(`flex flex-row justify-center items-center border-b border-slate-200`)}>
						<View style={tw.style(`flex-1 flex-col justify-center items-center p-2 pb-3`)}>
							<View style={tw.style(`w-full flex-row items-center px-2 pb-3`)}>
								<MaterialCommunityIcons
									name="account"
									size={30}
									color={tw.color('white')}
									style={tw.style(`rounded-full shadow-md bg-red-400 p-1 mr-2`)}
								/>
								<View style={tw.style(`flex-col px-1`)}>
									<Text style={tw.style(`font-extrabold text-slate-600`)}>{profile?.name}</Text>
									<Text style={tw.style(`text-sm text-slate-500`)}>{profile?.description}</Text>
								</View>
							</View>

							<Button mode="contained-tonal" onPress={onProfileNavigate}>
								{i18n.t('dashboard:profile:button:edit:profile')}
							</Button>
						</View>
					</View>

					{/* Menu Items */}
					<Menu.Item
						leadingIcon={props => <MaterialIcons name="person-add-alt" {...props} />}
						title={i18n.t('dashboard:profile:label:add:profile')}
						style={tw.style(`max-w-none`)}
					/>
					<Menu.Item style={tw.style(`max-w-none`)} title={i18n.t('dashboard:profile:label:manage:profiles')} />
				</Menu>
			)
		})
	}, [profile, menuVisibility, navigation])

	function onChangeSearch(query: string) {
		if (query.trim() !== '' && displayView.view === DashboardContentView.Categories) {
			setDisplayView({ view: DashboardContentView.Entries })
		}
		setSearchQuery(query)
	}

	function onToggleDisplayView(view: DashboardContentView, params?: ContentView['params']) {
		if (view === DashboardContentView.Entries) {
			setDisplayView({ view: DashboardContentView.Entries, params })
		} else {
			setDisplayView({ view: DashboardContentView.Categories })
			if (searchQuery.trim() !== '') {
				setSearchQuery('')
			}
		}
	}

	return (
		<View style={tw`flex-1`}>
			<Searchbar placeholder="Search" style={tw`m-2`} onChangeText={onChangeSearch} value={searchQuery} />

			{displayView.view === DashboardContentView.Categories && (
				<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
					<Categories onToggleDisplayView={onToggleDisplayView} />
				</Animated.View>
			)}

			{displayView.view === DashboardContentView.Entries && (
				<Animated.View entering={ZoomInEasyDown} exiting={ZoomOutEasyDown} style={tw`flex-1 m-2`}>
					<ListEntries {...displayView.params} searchQuery={searchQuery} onToggleDisplayView={onToggleDisplayView} />
				</Animated.View>
			)}
		</View>
	)
}
