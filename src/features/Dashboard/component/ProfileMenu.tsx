import { useMemo, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Button, IconButton, Menu, Text } from 'react-native-paper'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import tw from '@src/libs/tailwind'
import { MaterialIcons } from '@expo/vector-icons'
import { i18n } from '@src/app/locale'

import { ProfileMode } from '@src/common/enums'
import { getCurrentProfileId, setCurrentProfile } from '@src/store/slices/appSlice'
import { selectAllProfiles } from '@src/store/slices/profilesSlice'
import { OPMTypes } from '@src/common/types'
import Avatar from '@src/components/Avatar'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

export default function ProfileMenu() {
	const dispatch = useDispatch()
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const allProfiles = useSelector(selectAllProfiles)
	const currentProfileId = useSelector(getCurrentProfileId)

	const currentProfile = useMemo(
		() => allProfiles.find(p => p.id === currentProfileId),
		[currentProfileId, allProfiles]
	)

	const otherProfiles = useMemo(
		() => allProfiles.filter(p => p.id !== currentProfileId),
		[currentProfileId, allProfiles]
	)

	const [menuVisibility, setMenuVisibility] = useState<boolean>(false)

	if (!currentProfile) {
		return null
	}

	function onProfileNavigate(mode: 'Edit' | 'Add') {
		setMenuVisibility(false)

		if (mode === 'Add') {
			navigation.navigate({ name: 'AddProfile', params: {} })
		}
		if (mode === 'Edit' && currentProfile?.id) {
			navigation.navigate({
				name: 'ViewAndEditProfile',
				params: {
					data: { profile: { id: currentProfile.id } },
					mode: ProfileMode.EDIT
				}
			})
		}
	}

	function onSwitchProfile(profile: OPMTypes.Profile) {
		dispatch(setCurrentProfile({ profile }))
		setMenuVisibility(false)
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<>
				<Menu
					visible={menuVisibility}
					onDismiss={() => setMenuVisibility(false)}
					contentStyle={tw`bg-white`}
					style={tw`w-3/4`}
					anchor={
						<TouchableOpacity
							style={tw.style(`flex-row items-center justify-center`)}
							activeOpacity={1}
							onPress={() => setMenuVisibility(true)}
						>
							<Avatar
								icon={currentProfile.avatar}
								size={26}
								style={tw.style(`p-1 mr-1 border-gray-200`, { borderWidth: 1 })}
							/>
							<IconButton icon="dots-vertical" style={tw`m-0`} />
						</TouchableOpacity>
					}
					anchorPosition="bottom"
				>
					{/* Menu Header */}
					{currentProfile && (
						<View style={tw.style(`flex flex-row justify-center items-center border-b border-slate-200`)}>
							<View style={tw.style(`flex-1 flex-col justify-center items-center p-2 pb-3`)}>
								<View style={tw.style(`w-full flex-row items-center px-2 pb-3`)}>
									<Avatar icon={currentProfile.avatar} size={32} style={tw`p-1 mr-2`} />
									<View style={tw.style(`flex-col px-1`)}>
										<Text style={tw.style(`font-extrabold text-slate-600`)}>{currentProfile.name}</Text>
										<Text style={tw.style(`text-sm text-slate-500`)}>{currentProfile.description}</Text>
									</View>
								</View>

								<Button mode="contained-tonal" onPress={() => onProfileNavigate('Edit')}>
									{i18n.t('dashboard:profile:button:edit:profile')}
								</Button>
							</View>
						</View>
					)}

					{/* Menu Items */}
					{otherProfiles.map((p, idx) => {
						return (
							<Menu.Item
								key={`profile-menu-items-${idx}`}
								leadingIcon={props => <Avatar icon={p.avatar} {...props} size={24} />}
								titleStyle={tw`ml-1`}
								title={p.name}
								style={tw.style(`max-w-none`)}
								onPress={() => onSwitchProfile(p)}
							/>
						)
					})}

					<Menu.Item
						leadingIcon={props => <MaterialIcons name="person-add-alt" {...props} />}
						title={i18n.t('dashboard:profile:label:add:profile')}
						style={tw.style(`max-w-none`)}
						onPress={() => onProfileNavigate('Add')}
					/>
					<Menu.Item style={tw.style(`max-w-none`)} title={i18n.t('dashboard:profile:label:manage:profiles')} />
				</Menu>
			</>
		</TouchableWithoutFeedback>
	)
}
