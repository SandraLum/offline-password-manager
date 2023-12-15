import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { useHeaderHeight } from '@react-navigation/elements'
import { useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import { Searchbar, Button } from 'react-native-paper'

import tw from 'twrnc'
import Categories from '../Categories'

import { i18n } from '@src/app/locale'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { DashboardContentView } from '@src/common/enums'
import ListEntries from '../Entries/ListEntries'
import Animated, { FadeInDown, FadeOutDown, SlideInRight, SlideOutRight } from 'react-native-reanimated'
import ProfileMenu from './component/ProfileMenu'
import AuthScreen from '@src/components/AuthScreen'
import { DrawerParamList } from '@src/app/routes'
import Content from '@src/components/Content'
import { TextInput } from 'react-native-gesture-handler'

type ContentView = {
	view: DashboardContentView
	params?: { filter: { categories: string[] } }
}

type Props = NativeStackScreenProps<DrawerParamList, 'Dashboard'>

export default function Dashboard({ route }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const [displayView, setDisplayView] = useState<ContentView>({ view: DashboardContentView.Categories })
	const [searchQuery, setSearchQuery] = useState<string>('')
	const headerHeight = useHeaderHeight()

	useEffect(() => {
		console.log('askd')
		navigation.setOptions({
			// headerTransparent: true,
			headerStyle: { backgroundColor: '#fff' },
			headerTitle: props => (
				<View style={tw`min-w-[90%]`}>
					<TextInput
						style={tw`border-orange-500 border-[1px] rounded-xl flex p-1 px-2`}
						placeholderTextColor={tw.color('orange-500')}
						placeholder={i18n.t('search:bar:placeholder:search')}
						onChangeText={onChangeSearch}
						value={searchQuery}
					/>
					{/* <Searchbar
						placeholder={i18n.t('search:bar:placeholder:search')}
						style={tw`m-0 flex-1 bg-red-500 rounded-2xl p-0 min-h-[15px]`}
						inputStyle={tw`p-0 m-0 min-h-[15px]`}
						onChangeText={onChangeSearch}
						value={searchQuery}
						icon={() => null}
					/> */}
				</View>
			),
			headerRight: () => (
				<View style={tw`flex-row items-center`}>
					{/* <TextInput
						style={tw`bg-red-500 rounded-xl flex-1 mr-2 min-h-[35px]`}
						// placeholder={i18n.t('search:bar:placeholder:search')}
						onChangeText={onChangeSearch}
						value={searchQuery}
					/> */}
					{/* <Searchbar
						placeholder={i18n.t('search:bar:placeholder:search')}
						style={tw`m-0 flex-1 bg-red-500 rounded-2xl p-0 min-h-[15px]`}
						inputStyle={tw`p-0 m-0 min-h-[15px]`}
						onChangeText={onChangeSearch}
						value={searchQuery}
						icon={() => null}
					/> */}
					<ProfileMenu />
				</View>
			)
		})
		// @ts-expect-error: event is valid but react navigation ts is not updated
		const unsubscribe = navigation.addListener('drawerItemPress', () => {
			setDisplayView({ view: DashboardContentView.Categories })
		})

		return unsubscribe
	}, [navigation, route])

	function onChangeSearch(query: string) {
		if (query.trim() !== '' && displayView.view === DashboardContentView.Categories) {
			console.log('displayView q', displayView.view)
			setDisplayView({ view: DashboardContentView.Entries })
		}
		console.log('query', query)
		setSearchQuery(query)
	}

	function onToggleDisplayView(view: DashboardContentView, params?: ContentView['params']) {
		if (view === DashboardContentView.Entries) {
			setDisplayView({ view: DashboardContentView.Entries, params })
		} else {
			console.log('oasd')
			setDisplayView({ view: DashboardContentView.Categories })
			if (searchQuery.trim() !== '') {
				setSearchQuery('')
			}
		}
	}

	// SL TODO: remove
	function onTesting() {
		navigation.navigate('Settings:Testing')
	}

	return (
		<AuthScreen style={tw.style(`flex-1`, { backgroundColor: `rgba(53, 142, 148, 0)` })}>
			{/* <Searchbar
				placeholder={i18n.t('search:bar:placeholder:search')}
				style={tw`mx-2`}
				onChangeText={onChangeSearch}
				value={searchQuery}
			/> */}

			{displayView.view === DashboardContentView.Categories && (
				<Animated.View entering={FadeInDown} exiting={FadeOutDown} style={tw`flex-1`}>
					<Categories onToggleDisplayView={onToggleDisplayView} />
				</Animated.View>
			)}

			{displayView.view === DashboardContentView.Entries && (
				<Animated.View entering={SlideInRight} exiting={SlideOutRight} style={tw`flex-1`}>
					<ListEntries
						filter={displayView.params?.filter}
						searchQuery={searchQuery}
						onToggleDisplayView={onToggleDisplayView}
					/>
				</Animated.View>
			)}
		</AuthScreen>
	)
}
