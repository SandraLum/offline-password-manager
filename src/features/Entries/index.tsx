import { useState, useEffect } from 'react'
import { useNavigation, ParamListBase } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { View, Text } from 'react-native'
import { Searchbar, Button, List, Menu, IconButton } from 'react-native-paper'

import tw from 'twrnc'
import { i18n } from '@src/app/locale'

import Container from '@src/components/Container'
import Content from '@src/components/Content'
import IconInitialsBadge from '@src/components/IconInitialsBadge'

import { selectAllCategories } from '@src/features/Categories/categoriesSlice'
import { GroupEntry, selectAllGroupedEntries } from '@src/features/Entries/entriesSlice'
import { EntryMode } from '@src/common/enums'
import { RootStackParamList } from '@src/app/routes'
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack'
import { OPMTypes } from '@src/common/types'

type Props = NativeStackScreenProps<RootStackParamList, 'Entries'>

type GroupEntryWithFilterState = Omit<GroupEntry, 'entries'> & {
	entries: (OPMTypes.EntryWithoutCategory & { isFiltered?: boolean })[]
}

export default function Entries({ route }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const { filter } = route.params

	const allCategories: OPMTypes.Category[] = useSelector(selectAllCategories)
	const allGroupedEntries = useSelector(selectAllGroupedEntries)
	const [filteredGroupedEntries, setFilteredGroupedEntries] = useState<GroupEntryWithFilterState[]>([])
	const [searchQuery, setSearchQuery] = useState('')
	const [searchMatches, setSearchMatches] = useState<Record<string, number>>({})
	const [menuVisibility, setMenuVisibility] = useState<Record<string, boolean>>({})

	// Filter:
	useEffect(() => {
		let filteredEntries = []
		// filter by category
		if (filter.categories.length > 0) {
			filteredEntries = allGroupedEntries.filter(e => filter.categories.includes(e.category.id)) || []
		} else {
			filteredEntries = allGroupedEntries
		}

		setFilteredGroupedEntries(filteredEntries)
	}, [allGroupedEntries, filter.categories])

	useEffect(() => {
		function filterByQuery(entries: GroupEntryWithFilterState[], searchQuery: string): GroupEntryWithFilterState[] {
			const query = searchQuery.trim()
			const matches: Record<string, number> = {}

			let filteredEntries = []
			if (query.length > 0) {
				filteredEntries = entries.map(grp => {
					matches[grp.category.id] = 0
					const entries = grp.entries?.map(e => {
						const match = e.title.name.search(new RegExp(searchQuery, 'i')) > -1
						if (match) {
							matches[grp.category.id] += 1
						}
						return { ...e, isFiltered: !match }
					})
					return { ...grp, entries }
				})
			} else {
				filteredEntries = entries.map(grp => ({
					...grp,
					entries: grp.entries.map(e => ({ ...e, isFiltered: false }))
				}))
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
				data: { category: { id: category.id } }
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

	function onChangeSearch(text: string) {
		setSearchQuery(text)
	}

	function getCategory(id: string) {
		return allCategories.find(c => c.id === id)
	}

	function onToggleMenu(category: OPMTypes.ICategory, visible: boolean) {
		setMenuVisibility(m => ({ ...m, [category.id]: visible }))
	}

	return (
		<Container>
			<Searchbar placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />

			{/* List */}
			<Content horizontal={false} contentContainerStyle={tw`flex flex-col`}>
				{filteredGroupedEntries.map(group => {
					const entries = group.entries
					const category = getCategory(group.category.id)
					return (
						category && (
							<List.Section key={`c-${category.id}`}>
								{/* Header */}
								<List.Item
									title=""
									style={tw`py-1`}
									left={() => (
										<View style={tw`pl-2 flex-row items-center`}>
											<IconInitialsBadge bordered size={20} icon={category.icon} name={category.name} />
											<Text style={tw`font-bold pl-2`}>{category.name}</Text>
										</View>
									)}
									right={() => {
										return (
											<Menu
												visible={!!menuVisibility[category.id]}
												onDismiss={() => onToggleMenu(category, false)}
												anchor={
													<IconButton
														icon="dots-vertical"
														onPress={() => onToggleMenu(category, true)}
														style={tw`m-0`}
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

								<View style={tw.style(`border-cyan-800 rounded-lg mx-2 `, { borderWidth: 1 })}>
									{entries.length ? (
										searchMatches[category.id] === 0 ? (
											<List.Item
												title={i18n.t('entries:label:no:search:matches')}
												style={tw.style(`py-1 rounded-lg bg-zinc-50`)}
											/>
										) : (
											entries.map((entry, index) =>
												entry.isFiltered ? null : (
													<List.Item
														key={`c-${category.id}-i-${entry.id}`}
														title={entry.title.name}
														onPress={() => onViewEntry(entry)}
														left={() => (
															<IconInitialsBadge dense size={40} icon={entry.title.icon} name={entry.title.name} />
														)}
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
												<Button mode="contained-tonal" onPress={() => onAddNewEntry(category)}>
													{'+' + i18n.t('entries:button:add:new:entry')}
												</Button>
											)}
											style={tw.style(`py-1 rounded-lg bg-zinc-50`)}
										/>
									)}
								</View>
							</List.Section>
						)
					)
				})}
			</Content>
		</Container>
	)
}
