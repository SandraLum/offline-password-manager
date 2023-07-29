import { useRef, useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { Text, FlatList, View } from 'react-native'
import { Button, Card, IconButton } from 'react-native-paper'

import tw from 'twrnc'
import { i18n } from '@src/app/locale'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

// Components
import CategoryItemModal from './CategoryItemModal'

import { selectAllCategoriesDetails } from '@src/features/Categories/categoriesSlice'
import { selectAllEntriesByProfile } from '@src/features/Entries/entriesSlice'
import { CategoryType, DashboardContentView } from '@common/enums'
import { OPMTypes } from '@common/types'
import { getCurrentProfileId } from '@src/store/slices/appSlice'
import CategoryIcon from '@src/components/CategoryIcon'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Content from '@src/components/Content'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { onToggleDisplayView: (view: DashboardContentView, params: any) => void }

export default function Categories({ onToggleDisplayView }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dialogRef = useRef(null)

	const allCategories = useSelector(selectAllCategoriesDetails)
	const entries = useSelector(state => selectAllEntriesByProfile(state, getCurrentProfileId(state)))

	const [categories, setCategories] = useState<OPMTypes.Category[]>([])
	const [allItemsCategory, setAllItemsCategory] = useState<OPMTypes.Category | null>()

	useEffect(() => {
		setAllItemsCategory(allCategories.find(c => c.type === CategoryType.AllItems))
		setCategories(allCategories.filter(c => c.type !== CategoryType.AllItems) || [])
	}, [allCategories])

	function onAddNewEntry(category: OPMTypes.Category) {
		navigation.navigate({
			name: 'AddEntry',
			params: {
				data: { category: { id: category.id } }
			}
		})
	}

	function onViewEntries(category: OPMTypes.Category) {
		onToggleDisplayView(DashboardContentView.Entries, {
			filter: category.type === CategoryType.AllItems ? { categoriesIds: [] } : { categoriesIds: [category.id] }
		})
	}

	function renderCard({ item: category }: { item: OPMTypes.Category }) {
		const icon = category?.icon
		const totalEntries = entries.filter(i => i.category?.id === category.id)?.length

		return (
			<>
				<CategoryIcon
					style={tw.style(`left-4 z-4`, { marginBottom: -25, elevation: 3 })}
					size={40}
					padding={8}
					name={icon.name}
					backgroundColor={icon.bgColor}
					color={icon.color}
				/>
				<TouchableOpacity
					style={tw.style(`flex rounded-lg px-3 pb-3`, { backgroundColor: 'rgba(209, 233, 235, 0.9)' })}
					onPress={() => onViewEntries(category)}
				>
					<Text style={tw.style(`text-lg font-bold text-stone-600`, { marginTop: 30 })}>{category?.name}</Text>
					<IconButton
						mode="contained"
						icon="star"
						size={20}
						iconColor="black"
						containerColor="transparent"
						style={tw`absolute items-center right-0`}
						onPress={() => onViewEntries(category)}
					/>
					<View style={tw`flex flex-row items-center justify-between`}>
						<Text>{i18n.t('categories:card:entries:count', { totalEntries: totalEntries })}</Text>

						<IconButton
							mode="contained"
							icon="plus"
							size={24}
							iconColor="white"
							style={tw`m-0`}
							containerColor={tw.color('green-400')}
							onPress={() => onAddNewEntry(category)}
						/>
					</View>
				</TouchableOpacity>
			</>
		)
	}

	return (
		<Content horizontal={false} contentContainerStyle={tw.style(`flex p-1`)}>
			{/* All Items Card */}
			{allItemsCategory ? (
				<View>
					<Card mode="contained" style={tw.style(`m-1 bg-white`)} onPress={() => onViewEntries(allItemsCategory)}>
						<Card.Title
							titleNumberOfLines={2}
							title={allItemsCategory.name}
							subtitle={`Entries: ${entries.length}`}
							left={() => (
								<View style={tw`flex flex-row`}>
									<CategoryIcon
										size={32}
										name={allItemsCategory.icon.name}
										backgroundColor={allItemsCategory.icon.bgColor}
										color={allItemsCategory.icon.color}
									/>
								</View>
							)}
							style={tw`m-0 p-1 min-h-0`}
							titleStyle={tw`m-0 p-0 min-h-0 font-bold`}
							leftStyle={tw`p-0 m-1 mr-3`}
						/>
					</Card>
				</View>
			) : null}

			{/* Categories */}
			<View style={tw`pt-2`}>
				<Text style={tw`font-bold p-1`}>{i18n.t('categories:card:title:category')}</Text>
				{/* <FlatList
					data={categories}
					renderItem={({ item, index }) => {
						const lastItem = index === categories.length - 1
						return (
							<View
								style={tw.style(`p-3 z-20`, {
									flex: lastItem && categories.length % 2 !== 0 ? 0.5 : 1
								})}
							>
								{renderCard({ item })}
							</View>
						)
					}}
					keyExtractor={item => `${item.id}`}
					showsHorizontalScrollIndicator={false}
					numColumns={2}
				/> */}

				<View style={tw.style(`flex-row flex-wrap`)}>
					{categories.map(item => {
						return (
							<View key={`category-card-${item.id}`} style={tw.style(`px-2 py-1`, { width: '50%' })}>
								{renderCard({ item })}
							</View>
						)
					})}
				</View>

				<CategoryItemModal ref={dialogRef} />
			</View>
		</Content>
	)
}
