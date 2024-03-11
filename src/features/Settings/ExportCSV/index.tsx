import { useEffect, useState } from 'react'
import { View, Dimensions } from 'react-native'
import { Button, Text, TouchableRipple } from 'react-native-paper'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import tw from '@src/libs/tailwind'

import AuthScreen from '@src/components/AuthScreen'
import Avatar from '@src/components/Avatar'
import { i18n } from '@src/app/locale'
import { useSelector } from 'react-redux'

import { selectAllProfiles } from '@store/slices/profilesSlice'

import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MaterialIcons } from '@expo/vector-icons'
import { OPMTypes } from '@src/common/types'
import { RootStackParamList } from '@src/app/routes'

const AnimatedSelectView = ({ children, style, selected }: any) => {
	const borderWidth = useSharedValue(1)

	useEffect(() => {
		// @ts-expect-error Expecting a typescript fix from react-native-reanimated lib
		borderWidth.value = withSpring(selected ? 3 : 1, { duration: 300, mass: 3 })
	}, [selected])

	return (
		<Animated.View
			style={[style, { borderWidth }, { borderColor: selected ? tw.color(`blue-400`) : tw.color('gray-300') }]}
		>
			{children}
		</Animated.View>
	)
}

export default function ExportCSV() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const allProfiles = useSelector(selectAllProfiles)

	const itemWidth = 120
	const itemHeight = 110
	const itemsPerRow = Math.floor((Dimensions.get('window').width - 24) / (itemWidth + 8))
	const itemsOnLastRow = allProfiles.length % itemsPerRow
	const emptyItems = itemsOnLastRow > 0 ? Math.ceil(itemsPerRow - itemsOnLastRow) : null

	const [isLoading, setIsLoading] = useState(false)
	const [profilesSelected, setProfilesSelected] = useState<string[]>([])
	const [allSelected, setAllSelected] = useState<boolean>(false)

	async function onNext() {
		setIsLoading(true)
		const navigateToOptions = {
			name: 'Settings:ExportCSV:CSVGeneration',
			params: { type: 'csv', data: { key: '', profileIds: profilesSelected } }
		} as OPMTypes.NavigationOptions<RootStackParamList, 'Settings:ExportCSV:CSVGeneration'>

		navigation.navigate({
			name: 'Settings:VerifyPassword',
			params: { navigateToOptions }
		})

		setIsLoading(false)
	}

	function onToggleItem(item: string) {
		const items =
			profilesSelected.indexOf(item) >= 0 ? profilesSelected.filter(f => f !== item) : [...profilesSelected, item]

		setAllSelected(items.length === allProfiles.length)
		setProfilesSelected(items)
	}

	function onToggleAll() {
		if (allSelected) {
			setProfilesSelected([])
		} else {
			setProfilesSelected(allProfiles.map(p => p.id))
		}
		setAllSelected(!allSelected)
	}

	return (
		<AuthScreen style={tw`flex-1 bg-white`}>
			<View style={tw`bg-teal-500 p-2 border-slate-400 border`}>
				<Text style={tw`text-white text-base`}>{i18n.t('settings:export:csv:label:note')}</Text>
			</View>

			<View style={tw`flex p-2`}>
				<View style={tw`p-1 flex-row justify-between items-center`}>
					<Text style={tw`text-slate-700 text-lg font-bold`}>
						{i18n.t('settings:export:generated:label:all:profiles:note')}
					</Text>

					<MaterialIcons
						name={allSelected ? 'check-circle' : 'check-circle-outline'}
						size={30}
						color={allSelected ? tw.color('blue-400') : 'rgba(25, 28, 29, 0.3)'}
						onPress={onToggleAll}
					/>
				</View>

				<View style={tw`items-center justify-center flex-row flex-wrap pt-2`}>
					{allProfiles.map((profile, idx) => {
						const checked = profilesSelected.includes(profile.id)

						return (
							<TouchableRipple
								key={`csv-profile-${profile.id}-${idx}`}
								style={tw`w-[${itemWidth}px] h-[${itemHeight}px] m-1 rounded-2xl `}
								rippleColor="rgba(0, 0, 0, .32)"
								borderless={true}
								onPress={() => onToggleItem(profile.id)}
							>
								<AnimatedSelectView
									style={tw.style(`flex-1 flex-col items-center justify-center p-3 bg-white rounded-2xl border`)}
									selected={checked}
								>
									<MaterialIcons
										name={checked ? 'check-circle' : 'check-circle-outline'}
										size={26}
										color={checked ? tw.color('blue-400') : tw.color('neutral-400')}
										style={tw.style(`absolute left-1 top-1`)}
									/>
									<Avatar
										icon={profile.avatar}
										size={32}
										style={tw.style(`border-neutral-300 mb-1`, { borderWidth: 1 })}
									/>
									<Text style={tw`text-slate-600 text-base font-bold text-center `} numberOfLines={2}>
										{profile.name}
									</Text>
								</AnimatedSelectView>
							</TouchableRipple>
						)
					})}
					{emptyItems &&
						[...Array(emptyItems)].map((_, i) => (
							<View style={tw`w-[${itemWidth}px] h-[${itemHeight}px] m-1`} key={`dummy-${i}`} />
						))}
				</View>
			</View>

			<Button
				mode="contained"
				disabled={profilesSelected.length === 0}
				style={tw.style(`m-10`)}
				onPress={onNext}
				loading={isLoading}
			>
				{i18n.t('button:label:next')}
			</Button>
		</AuthScreen>
	)
}
