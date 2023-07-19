/* eslint-disable @typescript-eslint/ban-types */
import {
	NavigationContainer,
	NavigatorScreenParams,
	DefaultTheme,
	useNavigationContainerRef
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

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
import ChangePassword from '@src/features/Settings/ChangePassword'

import Testing from '@src/features/Settings/Testing'

import { theme } from './theme'
import CustomDrawer from './CustomDrawer'
import AppInitializer from '@src/features/AppInitializer'
import { checkIsAuthenticated } from '@src/store/slices/authSlice'
import { useSelector } from 'react-redux'
import AppWrapper from './AppWrapper'

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
	// Settings: {}
	// SettingsStack: {}
	'Settings:ChangePassword': {}
	'Settings:Testing': {}
}

export type DrawerParamList = {
	Dashboard: { view?: DashboardContentView; ts?: number }
	Settings: {}
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator<DrawerParamList>()

// function SettingsStack() {
// 	return (
// 		<Stack.Navigator initialRouteName="Settings">
// 			<Stack.Screen name="Settings" component={Settings} />
// 			<Stack.Screen name="Settings:ChangePassword" component={ChangePassword} />
// 		</Stack.Navigator>
// 	)
// }

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
			{/* <Drawer.Screen
				name="SettingsStack"
				component={SettingsStack}
				options={{
					// headerShown: false,
					title: i18n.t('routes:settings'),
					drawerIcon: props => <CustomDrawer.Icon {...props} name="cog" />
				}}
			/> */}
			<Drawer.Screen
				name="Settings"
				component={Settings}
				options={{
					// headerShown: false,
					title: i18n.t('routes:settings'),
					drawerIcon: props => <CustomDrawer.Icon {...props} name="cog" />
				}}
			/>
		</Drawer.Navigator>
	)
}

export default function Routes() {
	const navigationRef = useNavigationContainerRef()
	const isAuthenticated = useSelector(checkIsAuthenticated)

	console.log('-------------- ROUTES .......', isAuthenticated)

	return (
		<>
			<AppWrapper rootNavigation={navigationRef} isAuthenticated={isAuthenticated}>
				<NavigationContainer ref={navigationRef} theme={routeTheme}>
					<Stack.Navigator>
						{!isAuthenticated ? (
							<>
								<Stack.Screen name="AppInitializer" component={AppInitializer} options={{ headerShown: false }} />
								<Stack.Screen name="SetMasterPassword" component={SetMasterPassword} options={{ headerShown: false }} />
								<Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
							</>
						) : (
							<>
								<Stack.Screen name="App" component={DrawerStack} options={{ headerShown: false }} />
								<Stack.Screen name="AddEntry" component={AddEntry} />
								<Stack.Screen name="ViewEditEntry" component={ViewEditEntry} />
								<Stack.Screen
									name="ViewAndEditProfile"
									component={ViewAndEditProfile}
									options={{ title: i18n.t('routes:view:edit:profile') }}
								/>
								<Stack.Screen
									name="AddProfile"
									component={AddProfile}
									options={{ title: i18n.t('routes:add:profile') }}
								/>

								{/* Settings */}
								{/* <Stack.Screen name="Settings" component={Settings} /> */}
								<Stack.Screen
									name="Settings:ChangePassword"
									component={ChangePassword}
									options={{ title: i18n.t('routes:change:password') }}
								/>

								<Stack.Screen name="Settings:Testing" component={Testing} options={{ title: 'Testing' }} />
								{/* <Stack.Screen name="SettingsStack" component={SettingsStack} /> */}
							</>
						)}
					</Stack.Navigator>
				</NavigationContainer>
			</AppWrapper>
		</>
	)
}
