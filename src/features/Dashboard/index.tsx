import { useCallback, useEffect, useState } from 'react'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import tw from '@src/libs/tailwind'
import Categories from '../Categories'

import { ParamListBase, useNavigation } from '@react-navigation/native'
import { DashboardContentView } from '@src/common/enums'
import ListEntries from '../Entries/ListEntries'
import Animated, { FadeInDown, FadeOutDown, SlideInRight, SlideOutRight } from 'react-native-reanimated'
import AuthScreen from '@src/components/AuthScreen'
import { DrawerParamList } from '@src/app/routes'
import Header from './component/Header'

type ContentView = {
	view: DashboardContentView
	params?: { filter: { categories: string[] } }
}

type Props = NativeStackScreenProps<DrawerParamList, 'Dashboard'>

export default function Dashboard({ route }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const [displayView, setDisplayView] = useState<ContentView>({ view: DashboardContentView.Categories })
	const [searchQuery, setSearchQuery] = useState<string>('')

	const onToggleDisplayView = useCallback(
		(view: DashboardContentView, params?: ContentView['params']) => {
			if (view === DashboardContentView.Entries) {
				setDisplayView({ view: DashboardContentView.Entries, params })
			} else {
				setDisplayView({ view: DashboardContentView.Categories })
				if (searchQuery.trim() !== '') {
					setSearchQuery('')
				}
			}
		},
		[setSearchQuery, setDisplayView, searchQuery]
	)

	const onSearchChange = useCallback(
		(query: string) => {
			if (query.trim() !== '' && displayView.view === DashboardContentView.Categories) {
				onToggleDisplayView(DashboardContentView.Entries)
			}
			setSearchQuery(query)
		},
		[setSearchQuery]
	)

	useEffect(() => {
		navigation.setOptions({ headerShown: false })
		// @ts-expect-error: event is valid but react navigation ts is not updated
		const unsubscribe = navigation.addListener('drawerItemPress', () => {
			setDisplayView({ view: DashboardContentView.Categories })
		})

		return unsubscribe
	}, [navigation, route])

	return (
		<AuthScreen style={tw.style(`flex-1 bg-white`, { backgroundColor: `rgba(53, 142, 148, 0)` })}>
			<Header
				showDrawerIcon={displayView.view === DashboardContentView.Categories}
				onSearchChange={onSearchChange}
				onBackPress={() => onToggleDisplayView(DashboardContentView.Categories)}
			/>

			{displayView.view === DashboardContentView.Categories && (
				<Animated.View entering={FadeInDown} exiting={FadeOutDown} style={tw`flex-1`}>
					<Categories onToggleDisplayView={onToggleDisplayView} />
				</Animated.View>
			)}

			{displayView.view === DashboardContentView.Entries && (
				<Animated.View entering={SlideInRight} exiting={SlideOutRight} style={tw`flex-1`}>
					<ListEntries filter={displayView.params?.filter} searchQuery={searchQuery} />
				</Animated.View>
			)}
		</AuthScreen>
	)
}
