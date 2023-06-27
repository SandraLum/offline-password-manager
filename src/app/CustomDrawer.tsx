import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList
} from '@react-navigation/drawer'
import { Text, View, ViewStyle } from 'react-native'
import { StackActions } from '@react-navigation/native'
import { Divider } from 'react-native-paper'
import { i18n } from './locale'
import tw from 'twrnc'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentProfile } from '@src/store/slices/appSlice'
import Avatar from '@src/components/Avatar'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { invalidateSession } from '@src/store/slices/secureSlice'
import { AppDispatch } from '@src/store'

const Header = () => {
	const currentProfile = useSelector(selectCurrentProfile)

	const color = currentProfile?.avatar?.color
	const backgroundColor = (currentProfile?.avatar?.style as ViewStyle)?.backgroundColor || 'white'
	const size = 180
	return currentProfile ? (
		<View
			style={tw.style(`w-full justify-center p-3`, {
				backgroundColor: color,
				overflow: 'hidden',
				height: 90
			})}
		>
			{/* Design */}
			<View
				style={tw.style(`bg-white absolute rounded-full opacity-35`, {
					backgroundColor: backgroundColor,
					top: '40%',
					left: '-10%',
					width: size,
					height: size,
					transform: [{ scaleX: 3 }]
				})}
			/>

			<View style={tw`flex flex-row items-center`}>
				<Avatar
					icon={currentProfile.avatar}
					size={40}
					style={tw.style(`p-1 mr-4 border-gray-300`, { borderWidth: 1 })}
				/>
				<View style={tw`flex flex-col justify-center`}>
					<Text style={tw`text-neutral-700 font-bold text-xl`}>{currentProfile.name}</Text>
					<Text style={tw`text-neutral-700 text-sm`}>{currentProfile.description}</Text>
				</View>
			</View>
		</View>
	) : null
}

const Content = (props: DrawerContentComponentProps) => {
	const dispatch = useDispatch<AppDispatch>()

	function onLogout() {
		dispatch(invalidateSession)
		console.log('pop to top')
		props.navigation.dispatch(StackActions.popToTop())
	}

	return (
		<DrawerContentScrollView {...props}>
			<Header />
			<Divider bold style={tw`border-slate-500`} />
			<View style={tw`py-2`}>
				<DrawerItemList {...props} />
			</View>
			<Divider bold style={tw`border-slate-500`} />
			<DrawerItem
				icon={props => <Icon {...props} name="power" />}
				label={i18n.t('navigation:drawer:label:logout')}
				onPress={onLogout}
			/>
		</DrawerContentScrollView>
	)
}

const Icon = ({ size, focused, name }: any) => {
	return <MaterialCommunityIcons name={name} size={size} color={focused ? '#7cc' : '#ccc'} />
}

const CustomDrawer = {
	Content,
	Header,
	Icon
}
export default CustomDrawer
