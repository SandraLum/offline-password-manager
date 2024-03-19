import { useRef, useMemo } from 'react'

import { useSelector } from 'react-redux'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { IconButton } from 'react-native-paper'

import { selectAllFavouritedEntriesByProfile } from '@src/store/slices/entriesSlice'
import { getCurrentProfileId } from '@src/store/slices/appSlice'
import EntryIcon from '@src/components/EntryIcon'
import { OPMTypes } from '@src/common/types'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { EntryMode } from '@src/common/enums'
import tw from '@src/libs/tailwind'
import { i18n } from '@src/app/locale'
import Content from '@src/components/Content'

export default function Favourites() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const entries = useSelector(state => selectAllFavouritedEntriesByProfile(state, getCurrentProfileId(state)))
	const bgDesign = { size: 600 }

	function onViewEntry(entry: OPMTypes.EntryWithoutCategory) {
		navigation.navigate({
			name: 'ViewEditEntry',
			params: {
				mode: EntryMode.READ,
				data: { entry: { id: entry.id } }
			}
		})
	}

	return (
		<View>
			<View
				style={tw.style(`bg-white absolute rounded-3xl`, {
					backgroundColor: tw.color('white'),
					top: -30,
					width: '100%',
					height: '130%'
				})}
			/>

			<Text style={tw`px-3 pt-2 text-neutral-600 text-4 font-bold`}>{i18n.t('favourites:title:label')} </Text>
			<Content
				contentContainerStyle={tw`p-3`}
				horizontal={true}
				fadingEdgeLength={150}
				contentInsetAdjustmentBehavior="automatic"
			>
				<View style={tw`flex flex-row`}>
					{entries.length === 0 ? (
						<Text style={tw`pb-2`}>{i18n.t('favourites:label:no:fav')}</Text>
					) : (
						entries.map((entry, index) => {
							return (
								<TouchableOpacity
									key={`fav-${entry.id}`}
									onPress={() => onViewEntry(entry)}
									style={tw.style('flex-row items-center', index === 0 ? 'mr-2' : 'mx-2')}
								>
									<EntryIcon
										dense
										bordered
										size={35}
										icon={entry.title.icon}
										name={entry.title.name}
										containerStyle={tw`bg-white mr-2`}
									/>
									<Text>{entry.title.name}</Text>
								</TouchableOpacity>
							)
						})
					)}
				</View>
			</Content>
		</View>
	)
}
