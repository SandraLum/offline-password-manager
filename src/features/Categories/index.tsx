import { useRef, useEffect, useState } from 'react'

import { useSelector } from 'react-redux'
import { Text, FlatList, View } from 'react-native'
import { Button, Card } from 'react-native-paper'

import tw from 'twrnc'
import { i18n } from '@src/app/locale'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

// Components
import CategoryItemModal from './CategoryItemModal'
import VertMenu from '@src/components/VertMenu'
import IconInitialsBadge from '@src/components/IconInitialsBadge'
import { selectAllCategories } from '@src/features/Categories/categoriesSlice'
import { selectAllEntries } from '@src/features/Entries/entriesSlice'
import { CategoryType, DashboardContentView } from '@common/enums'
import { OPMTypes } from '@common/types'
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutDown, ZoomOut } from 'react-native-reanimated'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { onToggleDisplayView: (view: DashboardContentView, params: any) => void }

export default function Categories({ onToggleDisplayView }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dialogRef = useRef(null)

	const allCategories = useSelector(selectAllCategories)
	const entries = useSelector(selectAllEntries)

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
		// navigation.navigate({
		// 	name: 'Entries',
		// 	params: {
		// 		filter: category.type === CategoryType.AllItems ? { categories: [] } : { categories: [category.id] }
		// 	}
		// })
		onToggleDisplayView(DashboardContentView.Entries, {
			filter: category.type === CategoryType.AllItems ? { categories: [] } : { categories: [category.id] }
		})
	}

	function renderCard({ item: category }: { item: OPMTypes.Category }) {
		const icon = category?.icon
		const totalEntries = entries.filter(i => i.category?.id === category.id)?.length
		return (
			<Card mode="contained" style={tw.style(`flex-1 m-2 bg-white`)} onPress={() => onViewEntries(category)}>
				<Card.Title
					titleNumberOfLines={2}
					title={category?.name}
					subtitle={`Entries: ${totalEntries}`}
					left={() => <IconInitialsBadge icon={icon} name={category.name} iconType="category" size={32} />}
					style={tw`m-0 p-1 min-h-0`}
					titleStyle={tw`m-0 p-0 min-h-0 font-bold`}
					leftStyle={tw`p-0 m-1`}
					rightStyle={tw`p-0 m-0`}
					// right={props => <VertMenu data={category} {...props} />}
				/>

				<Card.Actions>
					<Button mode="contained-tonal" onPress={() => onAddNewEntry(category)}>
						{i18n.t('categories:card:button:text:add')}
					</Button>
				</Card.Actions>
			</Card>
		)
	}

	return (
		<View style={tw`flex flex-col p-1`}>
			{/* All Items Card */}
			{allItemsCategory ? (
				<View>
					<Card mode="contained" style={tw.style(`m-1 bg-white`)} onPress={() => onViewEntries(allItemsCategory)}>
						<Card.Title
							titleNumberOfLines={2}
							title={allItemsCategory.name}
							subtitle={`Entries: ${entries.length}`}
							left={() => (
								<IconInitialsBadge
									icon={allItemsCategory.icon}
									name={allItemsCategory.name}
									iconType="category"
									size={32}
								/>
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
				<FlatList
					data={categories}
					renderItem={({ item, index }) => {
						const lastItem = index === categories.length - 1
						return (
							<View style={tw.style({ flex: lastItem && categories.length % 2 !== 0 ? 0.5 : 1 })}>
								{renderCard({ item })}
							</View>
						)
					}}
					keyExtractor={item => `${item.id}`}
					showsHorizontalScrollIndicator={false}
					numColumns={2}
				/>
				<CategoryItemModal ref={dialogRef} />
			</View>
		</View>
	)
}
