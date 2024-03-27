/* eslint-disable @typescript-eslint/ban-types */
import {
	NavigationContainer,
	NavigatorScreenParams,
	DefaultTheme,
	useNavigationContainerRef,
	ParamListBase
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { i18n } from '@src/app/locale'
import { EntryMode, ProfileMode, DashboardContentView, CategoryId } from '@src/common/enums'

import SetMasterPassword from '@src/features/SetMasterPassword'
import Onboarding from '@src/features/Onboarding'
import Login from '@src/features/Login'
import Dashboard from '@src/features/Dashboard'
import ViewAndEditProfile from '@src/features/Profile/ViewAndEditProfile'
import AddProfile from '@src/features/Profile/AddProfile'
import AddEntry from '@src/features/Entries/AddEntry'
import ViewEditEntry from '@src/features/Entries/ViewEditEntry'
import Settings from '@src/features/Settings'
import ChangePassword from '@src/features/Settings/ChangePassword'
import PasswordRecoveryForm from '@src/features/PasswordRecovery/PasswordRecoveryForm'
import PasswordRecoveryPDF from '@src/features/PasswordRecovery/PDFViewer'

import Testing from '@src/features/Settings/Testing'

import { theme } from './theme'
import CustomDrawer from './CustomDrawer'
import AppInitializer from '@src/features/AppInitializer'
import { checkIsAuthenticated } from '@src/store/slices/authSlice'
import { useSelector } from 'react-redux'
import AppWrapper from './AppWrapper'

/** Settings */
import SettingsVerifyPassword from '@src/features/Settings/components/VerifyPassword'
import ExportCSV from '@src/features/Settings/ExportCSV'
import ExportCSVGeneration from '@src/features/Settings/ExportCSV/CSVGeneration'
import Backup from '@src/features/Settings/BackupData'
import ExportBackupGeneration from '@src/features/Settings/BackupData/BackupGeneration'
import Restore from '@src/features/Settings/RestoreData'
import RestoreProcess from '@src/features/Settings/RestoreData/RestoreProcess'

import { OPMTypes } from '@src/common/types'
// import ExportGeneration from '@src/features/Settings/ExportGeneration'

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
		data: { category: { id: OPMTypes.Category['id'] } }
	}
	ViewEditEntry: {
		data: { entry: { id: string } }
		mode: EntryMode.READ | EntryMode.EDIT
	}
	Entries: {
		filter: { categories: CategoryId[] }
		title: string
	}
	ViewAndEditProfile: {
		data: { profile: { id: string } }
		mode: ProfileMode.EDIT
	}
	AddProfile: {}
	Onboarding: {}
	'Settings:ChangePassword': {}
	'Settings:Testing': {}
	'Settings:VerifyPassword': {
		navigateToOptions?: OPMTypes.NavigationOptions<
			RootStackParamList,
			'Settings:Backup' | 'Settings:ExportCSV:CSVGeneration'
		>
	}
	'Settings:ExportCSV': {}
	'Settings:ExportCSV:CSVGeneration': { data: { key: string; profileIds: string[] } }
	'Settings:Backup': {}
	'Settings:Backup:BackupGeneration': { data: { key: string } }

	'Settings:Restore': {}
	'Settings:Restore:RestoreProcess': {}
	'PasswordRecovery:Form': {}
	'PasswordRecovery:PDF': { uri: string; filename: string }
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
					// headerShown: false,
					title: i18n.t('routes:settings'),
					drawerIcon: props => <CustomDrawer.Icon {...props} name="cog" />,
					unmountOnBlur: true
				}}
			/>
		</Drawer.Navigator>
	)
}

export default function Routes() {
	const navigationRef = useNavigationContainerRef()
	const isAuthenticated = useSelector(checkIsAuthenticated)

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

								<Stack.Group>
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
								</Stack.Group>

								<Stack.Group
									screenOptions={{
										presentation: 'transparentModal',
										contentStyle: { backgroundColor: '#40404040' },
										animation: 'slide_from_right'
									}}
								>
									<Stack.Screen name="Onboarding" component={Onboarding} options={{ headerShown: false }} />
									<Stack.Screen
										name="PasswordRecovery:Form"
										component={PasswordRecoveryForm}
										options={{ headerShown: false }}
									/>
									<Stack.Screen name="PasswordRecovery:PDF" component={PasswordRecoveryPDF} />
								</Stack.Group>

								{/* Settings */}
								<Stack.Screen
									name="Settings:ChangePassword"
									component={ChangePassword}
									options={{ title: i18n.t('routes:change:password') }}
								/>

								<Stack.Screen
									name="Settings:VerifyPassword"
									component={SettingsVerifyPassword}
									options={{ title: i18n.t('routes:settings:verify:password') }}
								/>

								<Stack.Group screenOptions={{ title: 'Export to CSV' }}>
									<Stack.Screen name="Settings:ExportCSV" component={ExportCSV} />

									<Stack.Screen name="Settings:ExportCSV:CSVGeneration" component={ExportCSVGeneration} />
								</Stack.Group>

								<Stack.Group screenOptions={{ title: 'Backup Data' }}>
									<Stack.Screen name="Settings:Backup" component={Backup} />
									<Stack.Screen name="Settings:Backup:BackupGeneration" component={ExportBackupGeneration} />
								</Stack.Group>

								<Stack.Group screenOptions={{ title: 'Restore Data' }}>
									<Stack.Screen name="Settings:Restore" component={Restore} />
									<Stack.Screen name="Settings:Restore:RestoreProcess" component={RestoreProcess} />
								</Stack.Group>

								<Stack.Screen name="Settings:Testing" component={Testing} options={{ title: 'Testing' }} />
							</>
						)}
					</Stack.Navigator>
				</NavigationContainer>
			</AppWrapper>
		</>
	)
}
