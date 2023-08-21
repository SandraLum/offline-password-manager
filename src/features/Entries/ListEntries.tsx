import { useState, useEffect } from 'react'
import { useNavigation, ParamListBase } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { View, Text } from 'react-native'
import { Button, List, Menu, IconButton } from 'react-native-paper'

import tw from 'twrnc'
import { i18n } from '@src/app/locale'

import Content from '@src/components/Content'
import { selectAllCategories } from '@src/store/slices/categoriesSlice'
import { GroupEntry, selectAllGroupedEntriesByProfile } from '@src/store/slices/entriesSlice'
import { DashboardContentView, EntryMode } from '@src/common/enums'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { OPMTypes } from '@src/common/types'
import Animated, { FlipInXDown } from 'react-native-reanimated'
import { getCurrentProfileId } from '@src/store/slices/appSlice'
import CategoryIcon from '@src/components/CategoryIcon'
import EntryIcon from '@src/components/EntryIcon'

// type _Props = NativeStackScreenProps<RootStackParamList, 'Entries'>

type Props = {
	searchQuery: string
	filter?: { categories: string[] }
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onToggleDisplayView: (view: DashboardContentView, params?: any) => void
}

type GroupEntryWithFilterState = Omit<GroupEntry, 'entries'> & {
	entries: (OPMTypes.EntryWithoutCategory & { isFiltered?: boolean })[]
}

export default function ListEntries(props: Props) {
	const { filter, searchQuery = '', onToggleDisplayView } = props
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const allCategories: OPMTypes.Category[] = useSelector(selectAllCategories)
	const allGroupedEntries = useSelector(state => selectAllGroupedEntriesByProfile(state, getCurrentProfileId(state)))
	const [filteredGroupedEntries, setFilteredGroupedEntries] = useState<GroupEntryWithFilterState[]>([])

	const [searchMatches, setSearchMatches] = useState<Record<string, number>>({})
	const [noMatches, setNoMatches] = useState<boolean>(false)
	const [menuVisibility, setMenuVisibility] = useState<Record<string, boolean>>({})

	// Filter:
	useEffect(() => {
		let filteredEntries = []
		const categoriesFilter = filter?.categories

		// filter by category
		if (categoriesFilter && categoriesFilter.length > 0) {
			filteredEntries = allGroupedEntries.filter(e => categoriesFilter.includes(e.category.type)) || []
			if (filteredEntries.length === 0) {
				categoriesFilter.forEach(type => {
					const category = allCategories.find(c => c.type === type)
					if (category) {
						filteredEntries.push({ category, entries: [] })
					}
				})
			}
		} else {
			filteredEntries = allGroupedEntries
		}

		setFilteredGroupedEntries(filteredEntries)
	}, [allCategories, allGroupedEntries, filter?.categories])

	useEffect(() => {
		function filterByQuery(entries: GroupEntryWithFilterState[], searchQuery: string): GroupEntryWithFilterState[] {
			const query = searchQuery.trim()
			const matches: Record<string, number> = {}

			let filteredEntries = []

			if (query.length > 0) {
				let count = 0
				filteredEntries = entries.map(grp => {
					matches[grp.category.type] = 0
					const entries = grp.entries?.map(e => {
						const match = e.title.name.search(new RegExp(searchQuery, 'i')) > -1
						if (match) {
							matches[grp.category.type] += 1
							count++
						}
						return { ...e, isFiltered: !match }
					})
					return { ...grp, entries }
				})

				setNoMatches(count === 0)
			} else {
				filteredEntries = entries.map(grp => ({
					...grp,
					entries: grp.entries.map(e => ({ ...e, isFiltered: false }))
				}))
				setNoMatches(false)
			}
			setSearchMatches(matches)

			return filteredEntries
		}

		// Filter by search text
		setFilteredGroupedEntries(filteredEntries => filterByQuery(filteredEntries, searchQuery))
	}, [searchQuery])

	function onAddNewEntry(category: OPMTypes.ICategory) {
		onToggleMenu(category, false)

		navigation.navigate({
			name: 'AddEntry',
			params: {
				data: { category: { type: category.type } }
			}
		})
	}

	function onViewEntry(entry: OPMTypes.EntryWithoutCategory) {
		navigation.navigate({
			name: 'ViewEditEntry',
			params: {
				mode: EntryMode.READ,
				data: { entry: { id: entry.id } }
			}
		})
	}

	function onToggleMenu(category: OPMTypes.ICategory, visible: boolean) {
		setMenuVisibility(m => ({ ...m, [category.type]: visible }))
	}

	return (
		<>
			{/* List */}
			<Content horizontal={false} contentContainerStyle={tw`flex flex-col p-1 pb-4 rounded-lg`} fadingEdgeLength={200}>
				{noMatches ? (
					<View style={tw`p-1`}>
						<Text style={tw`text-neutral-600`}>{i18n.t('entries:label:no:search:matches')}</Text>
					</View>
				) : (
					filteredGroupedEntries.map(group => {
						const entries = group.entries
						const category = group.category
						const toDisplayCategory = category && searchMatches[category.type] !== 0
						const categoryType = category.type
						return (
							toDisplayCategory && (
								<List.Section key={`c-${categoryType}`} style={tw`pb-3 rounded-lg bg-white`}>
									{/* Header */}
									<List.Item
										title=""
										style={tw.style(`py-0 px-1`)}
										left={() => (
											<View style={tw`pl-1 flex-row items-center`}>
												<CategoryIcon
													size={20}
													name={category.icon.name}
													backgroundColor={category.icon.bgColor}
													color={category.icon.color}
												/>
												<Text style={tw`font-bold pl-2`}>{category.name}</Text>
											</View>
										)}
										right={() => {
											return (
												<Menu
													anchorPosition="bottom"
													visible={!!menuVisibility[categoryType]}
													onDismiss={() => onToggleMenu(category, false)}
													anchor={
														<IconButton
															icon="dots-vertical"
															style={tw`m-0`}
															onPress={() => onToggleMenu(category, true)}
														/>
													}
												>
													<Menu.Item
														onPress={() => onAddNewEntry(category)}
														title={i18n.t('entries:menu:add:new:entry')}
													/>
												</Menu>
											)
										}}
									/>

									<View style={tw.style(`border-[#b8d1cc] rounded-lg mx-3`, { borderWidth: 1 })}>
										{entries.length ? (
											searchMatches[categoryType] === 0 ? (
												<List.Item
													title={i18n.t('entries:label:no:search:matches')}
													style={tw.style(`py-1 rounded-lg bg-zinc-50`)}
												/>
											) : (
												entries.map((entry, index) =>
													entry.isFiltered ? null : (
														<List.Item
															key={`c-${categoryType}-i-${entry.id}`}
															title={entry.title.name}
															onPress={() => onViewEntry(entry)}
															left={() => <EntryIcon dense size={40} icon={entry.title.icon} name={entry.title.name} />}
															style={tw.style(
																'py-0 px-2 bg-zinc-50',
																index === 0 && 'rounded-t-lg',
																index === entries.length - 1 && 'rounded-b-lg',
																entries.length > 1 && {
																	borderBottomColor: tw.color('slate-200'),
																	borderBottomWidth: 1
																}
															)}
														/>
													)
												)
											)
										) : (
											<List.Item
												title={i18n.t('entries:label:no:entries')}
												right={() => (
													// <Button mode="contained-tonal" onPress={() => onAddNewEntry(category)}>
													// 	{i18n.t('entries:button:add:new:entry')}
													// </Button>
													<IconButton
														mode="contained"
														icon="plus"
														size={24}
														iconColor="white"
														style={tw`m-0`}
														containerColor={tw.color('green-400')}
														onPress={() => onAddNewEntry(category)}
													/>
												)}
												style={tw.style(`py-1 pr-2 mr-0 rounded-lg bg-zinc-50`)}
											/>
										)}
									</View>
								</List.Section>
							)
						)
					})
				)}
			</Content>

			<Animated.View entering={FlipInXDown.delay(300)} style={tw`flex items-center`}>
				<IconButton
					icon={'chevron-left'}
					size={34}
					style={tw`bg-teal-800`}
					iconColor="white"
					onPress={() => onToggleDisplayView(DashboardContentView.Categories)}
				/>
				{/* <Button style={tw`mt-2`} mode="contained" onPress={() => onToggleDisplayView(DashboardContentView.Categories)}>
					<Text>></Text>
				</Button> */}
			</Animated.View>
		</>
	)
}
