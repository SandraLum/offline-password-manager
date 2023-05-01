import { Fragment } from 'react'
import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import SetMasterPassword from '@src/features/SetMasterPassword'
import Dashboard from '@src/features/Dashboard'
import Entries from '@src/features/Entries'
import AddEntry from '@src/features/Entries/AddEntry'

import { i18n } from '@src/app/locale'
import { EntryMode, ProfileMode } from '@src/common/enums'
import ViewEditEntry from '@src/features/Entries/ViewEditEntry'
import Settings from '@src/features/Settings'
import ViewAndEditProfile from '@src/features/Profile/ViewAndEditProfile'
// import { SafeAreaView } from 'react-native-safe-area-context'

export type RootStackParamList = {
	initMasterPassword: { userId: string }
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

	// EntryForm: {
	// 	data: { entry?: { id: string }; category?: { id: string } }
	// 	mode: 'NEW' | 'READ' | 'EDIT'
	// }
}

export type DrawerParamList = {
	Dashboard: {}
	Settings: {}
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Drawer = createDrawerNavigator<DrawerParamList>()

function DrawerStack() {
	return (
		<Drawer.Navigator initialRouteName="Dashboard">
			<Drawer.Screen
				name="Dashboard"
				component={Dashboard}
				options={{ title: i18n.t('routes:dashboard') }}
			></Drawer.Screen>
			<Drawer.Screen name="Settings" component={Settings} options={{ title: i18n.t('routes:settings') }} />
		</Drawer.Navigator>
	)
}

export default function Routes() {
	return (
		// <SafeAreaView style={tw`flex-1`} forceInset={{ top: 'never' }} edges={['top', 'left', 'right']}>
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="initMasterPassword" component={SetMasterPassword} options={{ headerShown: false }} />
				<Stack.Screen name="App" component={DrawerStack} options={{ headerShown: false }} />
				<Stack.Screen name="AddEntry" component={AddEntry} options={() => ({ headerRight: () => <Fragment /> })} />
				<Stack.Screen
					name="ViewEditEntry"
					component={ViewEditEntry}
					options={() => ({ headerRight: () => <Fragment /> })}
				/>
				<Stack.Screen
					name="Entries"
					component={Entries}
					options={({ route }) => ({ title: route.params.title, animationEnabled: false })}
				/>
				<Stack.Screen
					name="ViewAndEditProfile"
					component={ViewAndEditProfile}
					options={{ title: i18n.t('routes:view:edit:profile') }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
		// </SafeAreaView>
	)
}
