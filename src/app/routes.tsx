/* eslint-disable @typescript-eslint/ban-types */
import { NavigationContainer, NavigatorScreenParams, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer'
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { StackActions } from '@react-navigation/native'

import SetMasterPassword from '@src/features/SetMasterPassword'
import Login from '@src/features/Login'
import Dashboard from '@src/features/Dashboard'
import AddEntry from '@src/features/Entries/AddEntry'

import { i18n } from '@src/app/locale'
import { EntryMode, ProfileMode, DashboardContentView } from '@src/common/enums'
import ViewEditEntry from '@src/features/Entries/ViewEditEntry'
import Settings from '@src/features/Settings'
import ViewAndEditProfile from '@src/features/Profile/ViewAndEditProfile'
import AddProfile from '@src/features/Profile/AddProfile'

import tw from 'twrnc'
import { theme } from './theme'
import CustomDrawer from './CustomDrawer'
import AppInitializer from '@src/features/AppInitializer'
// import { SafeAreaView } from 'react-native-safe-area-context'

const routeTheme = {
	...DefaultTheme,
	dark: true,
	colors: { ...DefaultTheme.colors, primary: theme.colors.primary }
}

export type RootStackParamList = {
	AppInitializer: {}
	SetMasterPassword: {}
	Login: {}
	App: NavigatorScreenParams<DrawerParamList>
	AddEntry: {
		data: { category: { id: string } }
	}
	ViewEditEntry: {
		data: { entry: { id: string } }
		mode: EntryMode.READ | EntryMode.EDIT
	}
	Entries: {
		filter: { categories: string[] }
		title: string
	}
	ViewAndEditProfile: {
		data: { profile: { id: string } }
		mode: ProfileMode.EDIT
	}
	AddProfile: {}
}

export type DrawerParamList = {
	Dashboard: { view?: DashboardContentView; ts?: number }
	Settings: {}
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator<DrawerParamList>()

function DrawerStack() {
	return (
		<Drawer.Navigator initialRouteName="Dashboard" drawerContent={CustomDrawer.Content}>
			<Drawer.Screen
				name="Dashboard"
				component={Dashboard}
				options={{
					title: i18n.t('routes:dashboard'),
					drawerIcon: props => <CustomDrawer.Icon {...props} name="home" />
				}}
			/>
			<Drawer.Screen
				name="Settings"
				component={Settings}
				options={{
					title: i18n.t('routes:settings'),
					drawerIcon: props => <CustomDrawer.Icon {...props} name="cog" />
				}}
			/>
		</Drawer.Navigator>
	)
}

export default function Routes() {
	return (
		// <SafeAreaView style={tw`flex-1`} forceInset={{ top: 'never' }} edges={['top', 'left', 'right']}>
		<NavigationContainer theme={routeTheme}>
			<Stack.Navigator>
				<Stack.Screen name="AppInitializer" component={AppInitializer} options={{ headerShown: false }} />
				<Stack.Screen name="SetMasterPassword" component={SetMasterPassword} options={{ headerShown: false }} />
				<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
				<Stack.Screen name="App" component={DrawerStack} options={{ headerShown: false }} />
				<Stack.Screen name="AddEntry" component={AddEntry} />
				<Stack.Screen name="ViewEditEntry" component={ViewEditEntry} />
				<Stack.Screen
					name="ViewAndEditProfile"
					component={ViewAndEditProfile}
					options={{ title: i18n.t('routes:view:edit:profile') }}
				/>
				<Stack.Screen name="AddProfile" component={AddProfile} options={{ title: i18n.t('routes:add:profile') }} />
			</Stack.Navigator>
		</NavigationContainer>
		// </SafeAreaView>
	)
}
