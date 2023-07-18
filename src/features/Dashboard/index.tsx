import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Searchbar } from 'react-native-paper'

import tw from 'twrnc'
import Categories from '../Categories'

import { i18n } from '@src/app/locale'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { DashboardContentView } from '@src/common/enums'
import ListEntries from '../Entries/ListEntries'
import Animated, { FadeInDown, FadeOutDown, ZoomInEasyDown, ZoomOutEasyDown } from 'react-native-reanimated'
import ProfileMenu from './component/ProfileMenu'
import Container from '@src/components/Container'
import { DrawerParamList } from '@src/app/routes'
import Content from '@src/components/Content'

type ContentView = {
	view: DashboardContentView
	params?: { filter: { categories: string[] } }
}

type Props = NativeStackScreenProps<DrawerParamList, 'Dashboard'>

export default function Dashboard({ route }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const [displayView, setDisplayView] = useState<ContentView>({ view: DashboardContentView.Categories })
	const [searchQuery, setSearchQuery] = useState<string>('')

	useEffect(() => {
		navigation.setOptions({ headerRight: () => <ProfileMenu /> })
		// @ts-expect-error: event is valid but react navigation ts is not updated
		const unsubscribe = navigation.addListener('drawerItemPress', () => {
			setDisplayView({ view: DashboardContentView.Categories })
		})

		return unsubscribe
	}, [navigation, route])

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
		<Container personalizeHeader={true} style={tw`flex-1`}>
			<Searchbar
				placeholder={i18n.t('search:bar:placeholder:search')}
				style={tw`m-2`}
				onChangeText={onChangeSearch}
				value={searchQuery}
			/>

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
		</Container>
	)
}
