import { useState, useMemo } from 'react'
import { useNavigation, ParamListBase } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { View, Text } from 'react-native'
import { List, IconButton } from 'react-native-paper'

import tw from 'twrnc'
import { i18n } from '@src/app/locale'

import Content from '@src/components/Content'
import { selectAllCategories } from '@src/store/slices/categoriesSlice'
import { GroupEntry, selectAllGroupedEntriesByProfile } from '@src/store/slices/entriesSlice'
import { EntryMode } from '@src/common/enums'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { OPMTypes } from '@src/common/types'
import { getCurrentProfileId } from '@src/store/slices/appSlice'
import CategoryIcon from '@src/components/CategoryIcon'
import EntryIcon from '@src/components/EntryIcon'

type Props = {
	searchQuery: string
	filter?: { categories: string[] }
}

type GroupEntryWithFilterState = Omit<GroupEntry, 'entries'> & {
	entries: (OPMTypes.EntryWithoutCategory & { isFiltered?: boolean })[]
}

export default function ListEntries(props: Props) {
	const { filter, searchQuery = '' } = props
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const allCategories: OPMTypes.Category[] = useSelector(selectAllCategories)
	const allGroupedEntries = useSelector(state => selectAllGroupedEntriesByProfile(state, getCurrentProfileId(state)))
	// const [filteredGroupedEntries, setFilteredGroupedEntries] = useState<GroupEntryWithFilterState[]>([])

	const [searchMatches, setSearchMatches] = useState<Record<string, number>>({})
	const [noMatches, setNoMatches] = useState<boolean>(false)
	const [menuVisibility, setMenuVisibility] = useState<Record<string, boolean>>({})

	const filteredGroupedEntries: GroupEntryWithFilterState[] = useMemo<GroupEntryWithFilterState[]>(() => {
		const categoriesFilter = filter?.categories
		let filteredEntries = []

		// filter by category
		if (categoriesFilter && categoriesFilter.length > 0) {
			filteredEntries = allGroupedEntries.filter(e => categoriesFilter.includes(e.category.id)) || []
			if (filteredEntries.length === 0) {
				categoriesFilter.forEach(type => {
					const category = allCategories.find(c => c.id === type)
					if (category) {
						filteredEntries.push({ category, entries: [] })
					}
				})
			}
		} else {
			return allGroupedEntries
		}
		return filteredEntries
	}, [allCategories, allGroupedEntries, filter?.categories])

	const filteredGroupedEntriesByQuery: GroupEntryWithFilterState[] = useMemo<GroupEntryWithFilterState[]>(() => {
		const query = searchQuery.trim()
		let filteredEntries: GroupEntryWithFilterState[] = []
		if (query.length > 0) {
			filteredEntries = allGroupedEntries.filter(grp => {
				const entries = grp.entries?.filter(e => e.title.name.search(new RegExp(searchQuery, 'i')) > -1)
				return entries.length > 0
			})
		}
		return filteredEntries
	}, [filteredGroupedEntries, searchQuery])

	const noSearchMatches = searchQuery.length > 0 && filteredGroupedEntriesByQuery.length === 0

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

	function onToggleMenu(category: OPMTypes.ICategory, visible: boolean) {
		setMenuVisibility(m => ({ ...m, [category.id]: visible }))
	}

	function renderGroup(groupedEntries: GroupEntryWithFilterState[]) {
		return groupedEntries.map(group => {
			const entries = group.entries
			const category = group.category
			const categoryType = category.id
			return (
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
								<IconButton
									mode="contained"
									icon="plus"
									style={tw`m-1`}
									size={15}
									iconColor="white"
									containerColor={tw.color('green-500')}
									onPress={() => onAddNewEntry(category)}
								/>
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
		})
	}

	return (
		<>
			<Content horizontal={false} contentContainerStyle={tw`p-3`} fadingEdgeLength={50}>
				{noSearchMatches ? (
					<View style={tw`p-1`}>
						<Text style={tw`text-neutral-600`}>
							{i18n.t('entries:label:no:search:matches', { s: `"${searchQuery}"` })}
						</Text>
					</View>
				) : (
					renderGroup(filteredGroupedEntriesByQuery.length > 0 ? filteredGroupedEntriesByQuery : filteredGroupedEntries)
				)}
			</Content>
		</>
	)
}
