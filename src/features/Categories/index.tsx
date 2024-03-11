import { useRef, useEffect, useState, useMemo } from 'react'

import { useSelector } from 'react-redux'
import { Text, View } from 'react-native'
import { Card, IconButton } from 'react-native-paper'

import tw from '@src/libs/tailwind'
import { i18n } from '@src/app/locale'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

// Components
import CategoryItemModal from './CategoryItemModal'

import { selectAllCategories } from '@src/store/slices/categoriesSlice'
import { selectAllEntriesByProfile } from '@src/store/slices/entriesSlice'
import { CategoryId, DashboardContentView } from '@common/enums'
import { OPMTypes } from '@common/types'
import { getCurrentProfileId } from '@src/store/slices/appSlice'
import CategoryIcon from '@src/components/CategoryIcon'
import { TouchableOpacity } from 'react-native'
import Content from '@src/components/Content'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { onToggleDisplayView: (view: DashboardContentView, params: any) => void }

export default function Categories({ onToggleDisplayView }: Props) {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dialogRef = useRef(null)

	const categories = useSelector(selectAllCategories)
	const entries = useSelector(state => selectAllEntriesByProfile(state, getCurrentProfileId(state)))

	const allCategory = useMemo(() => categories.find(c => c.id === CategoryId.AllItems), [])

	const otherCategories = useMemo(() => categories.filter(c => c.id !== CategoryId.AllItems) || [], [])

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
			filter: category.id === CategoryId.AllItems ? { categories: [] } : { categories: [category.id] }
		})
	}

	function renderCard(category: OPMTypes.Category) {
		const icon = category?.icon
		const totalEntries = entries.filter(i => i.category.id === category.id)?.length

		return (
			<>
				<TouchableOpacity style={tw.style(`flex rounded-lg bg-white`)} onPress={() => onViewEntries(category)}>
					<View style={tw.style(`flex flex-row`, { overflow: 'hidden' })}>
						<CategoryIcon
							style={tw.style(`absolute self-start left-[-12px] top-[-5px]`, { opacity: 0.07 })}
							size={70}
							padding={15}
							name={icon.name}
							backgroundColor={icon.bgColor}
							color="black"
						/>
						<View style={tw`flex-1 justify-center items-center py-1`}>
							<Text style={tw.style(`text-5 font-bold p-2 text-neutral-700`)}>{category?.name}</Text>
							{totalEntries > 0 && (
								<Text style={tw.style({ fontStyle: 'italic', fontFamily: 'normal' }, `text-neutral-600 text-4`)}>
									{i18n.t('categories:card:entries:count', { totalEntries: totalEntries })}
								</Text>
							)}
						</View>
						<View>
							<IconButton
								icon="star-outline"
								size={20}
								iconColor="orange"
								containerColor="transparent"
								style={tw`items-center ml-auto`}
								onPress={() => onViewEntries(category)}
							/>

							<IconButton
								mode="outlined"
								icon="plus"
								size={20}
								iconColor={tw.color('green-600')}
								style={tw`rounded-lg border-green-600 ml-auto`}
								containerColor={tw.color('transparent')}
								onPress={() => onAddNewEntry(category)}
							/>
						</View>
					</View>
					{/* <View style={tw`flex flex-row items-center`}> */}
					{/* <Text>{i18n.t('categories:card:entries:count', { totalEntries: totalEntries })}</Text> */}

					{/* </View> */}
				</TouchableOpacity>
			</>
		)
	}

	return (
		<Content contentContainerStyle={tw`p-3`} fadingEdgeLength={50} contentInsetAdjustmentBehavior="automatic">
			{/* All Items Card */}
			{allCategory ? (
				<View style={tw`flex-1`}>
					<Card mode="contained" style={tw.style(`m-1 bg-white`)} onPress={() => onViewEntries(allCategory)}>
						<Card.Title
							titleNumberOfLines={2}
							title={allCategory.name}
							subtitle={`Entries: ${entries.length}`}
							left={() => (
								<View style={tw`flex flex-row`}>
									<CategoryIcon
										size={32}
										name={allCategory.icon.name}
										backgroundColor={allCategory.icon.bgColor}
										color={allCategory.icon.color}
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
			{otherCategories.length > 0 ? (
				<View style={tw`pt-2`}>
					<Text style={tw`font-bold text-5 p-1`}>{i18n.t('categories:card:title:category')}</Text>

					<View style={tw.style(`flex-row flex-wrap`)}>
						{otherCategories.map(c => {
							return (
								<View key={`category-card-${c.id}`} style={tw.style(`px-2 py-1`, { width: '50%' })}>
									{renderCard(c)}
								</View>
							)
						})}
					</View>

					<CategoryItemModal ref={dialogRef} />
				</View>
			) : null}
		</Content>
	)
}
