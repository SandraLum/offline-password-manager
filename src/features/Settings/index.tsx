import { useEffect, useState } from 'react'
import { Text, ToastAndroid, View } from 'react-native'
import { Button, List, Switch } from 'react-native-paper'
import * as ScreenCapture from 'expo-screen-capture'

import { i18n } from '@src/app/locale'
import tw from '@src/libs/tailwind'
import AuthScreen from '@src/components/AuthScreen'

import Content from '@src/components/Content'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import {
	selectUserSettings,
	setAllowCopy,
	setAllowScreenCapture,
	setAllowAutoLock,
	setHidePassword
} from '@store/slices/settingSlice'
import { factoryReset } from '@src/store/slices/appSlice'
import { AppDispatch } from '@src/store'
import AlertModal from '@src/components/AlertModal'

export default function Settings() {
	const dispatch = useDispatch<AppDispatch>()
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()

	const { allowCopy, allowScreenCapture, allowAutoLock, defaultHidePassword } = useSelector(selectUserSettings)

	function navigateTo({ screen, params = {} }: { screen: string; params?: object }) {
		navigation.navigate({ name: screen, params: params })
	}

	const [showOptions, setShowOptions] = useState({ screenCapture: false })
	const [isAllowCopy, setIsAllowCopy] = useState(allowCopy)
	const [isAllowScreenCapture, setIsAllowScreenCapture] = useState(allowScreenCapture)
	const [isHidePassword, setIsHidePassword] = useState(defaultHidePassword)
	const [isAutoLock, setIsAutoLock] = useState(allowAutoLock)
	const [alertVisible, setAlertVisible] = useState(false)

	const showAlert = () => setAlertVisible(true)
	const hideAlert = () => setAlertVisible(false)

	useEffect(() => {
		const init = async () => {
			const avail = await ScreenCapture.isAvailableAsync()
			setShowOptions(o => ({ ...o, screenCapture: avail }))
			setIsAllowScreenCapture(allowScreenCapture)
			setIsAllowCopy(allowCopy)
			setAllowAutoLock(allowAutoLock)
			setHidePassword(defaultHidePassword)
		}
		init()
	}, [])

	const onToggleAllowCopy = () => {
		const allow = !isAllowCopy
		setIsAllowCopy(allow)
		dispatch(setAllowCopy(allow))
		ToastAndroid.show(`Copy button ${allow ? 'shown' : 'hidden'}`, 2000)
	}

	const onToggleAllowScreenCapture = async () => {
		const allow = !isAllowScreenCapture
		setIsAllowScreenCapture(allow)
		dispatch(setAllowScreenCapture(allow))
		ToastAndroid.show(`Screenshot ${allow ? 'enabled' : 'disabled'}`, 2000)
	}

	const onToggleHidePassword = async () => {
		const allow = !isHidePassword
		setIsHidePassword(allow)
		dispatch(setHidePassword(allow))
		ToastAndroid.show(`Password ${allow ? 'shown' : 'hidden'} by default`, 2000)
	}

	const onToggleAutoLock = async () => {
		const allow = !isAutoLock
		setIsAutoLock(allow)
		dispatch(setAllowAutoLock(allow))
		ToastAndroid.show(`${allow ? 'Auto-lock enabled' : 'Auto-lock disabled'}`, 2000)
	}

	function onResetApp() {
		dispatch(factoryReset())
	}

	return (
		<AuthScreen>
			<Content horizontal={false}>
				<View style={tw`flex justify-center`}>
					<List.Section>
						<List.Subheader>{i18n.t('settings:subheader:general')}</List.Subheader>
						<List.Item
							title="Testing"
							left={props => <List.Icon {...props} icon="help" />}
							onPress={() => navigateTo({ screen: 'Settings:Testing' })}
						/>
						{/* <List.Item title="Theme mode" left={props => <List.Icon {...props} icon="theme-light-dark" />} /> */}
						{/* <List.Item title="Change theme" left={props => <List.Icon {...props} icon="palette" />} /> */}
						<List.Item
							title="Language - English"
							onPress={() => ToastAndroid.show(i18n.t('developer:nope:not:priority'), 5000)}
							left={props => <List.Icon {...props} icon="globe-model" />}
						/>
						<List.Item
							title="Hide Password by default"
							description={'Password will be masked and will only be shown when you click on the eye icon'}
							left={props => <List.Icon {...props} icon="eye-off" />}
							right={() => <Switch value={isHidePassword} onValueChange={onToggleHidePassword} />}
						/>
						<List.Item
							title={`Show copy buttons`}
							left={props => <List.Icon {...props} icon="content-copy" />}
							right={() => <Switch value={isAllowCopy} onValueChange={onToggleAllowCopy} />}
						/>
					</List.Section>

					<List.Section>
						<List.Subheader>{i18n.t('settings:subheader:backup:export')}</List.Subheader>

						<List.Item
							title="Export to CSV"
							description={'Exports your entries to csv file'}
							left={props => <List.Icon {...props} icon="microsoft-excel" />}
							onPress={() => navigateTo({ screen: 'Settings:ExportCSV' })}
						/>
						<List.Item
							title="Backup data"
							description={'Backup your data into an encrypted file'}
							left={props => <List.Icon {...props} icon="content-save" />}
							onPress={() => {
								navigation.navigate({
									name: 'Settings:Backup',
									params: {}
								})
							}}
						/>
						<List.Item
							title="Restore data"
							description={'Restores a valid backup file into the app. The current entries will be overwritten.'}
							left={props => <List.Icon {...props} icon="import" />}
							onPress={() => {
								navigation.navigate({
									name: 'Settings:Restore',
									params: {}
								})
							}}
						/>
					</List.Section>

					<List.Section>
						<List.Subheader>{i18n.t('settings:subheader:security')}</List.Subheader>
						{showOptions.screenCapture ? (
							<List.Item
								title="Allow screenshot"
								left={props => <List.Icon {...props} icon="cellphone-screenshot" />}
								right={() => <Switch value={isAllowScreenCapture} onValueChange={onToggleAllowScreenCapture} />}
							/>
						) : null}
						<List.Item
							title="Change Password"
							left={props => <List.Icon {...props} icon="lock" />}
							onPress={() => navigateTo({ screen: 'Settings:ChangePassword' })}
						/>
						{/* <List.Item
							title="Biometrics"
							description={'Use biometrics (fingerprint/face recognition) to login for biometric supported'}
							left={props => <List.Icon {...props} icon="fingerprint" />}
						/> */}
						<List.Item
							title="Auto-lock"
							description={'Lock app automatically after a certain interval in the background'}
							left={props => <List.Icon {...props} icon="lock-clock" />}
							right={() => <Switch value={isAutoLock} onValueChange={onToggleAutoLock} />}
						/>
						<List.Item
							title="Manually reset app and removes all entries"
							description={'Removes all entries and reset the app. This action cannot be undone.'}
							left={props => <List.Icon {...props} icon="delete-forever" />}
							onPress={showAlert}
						/>
					</List.Section>
				</View>

				<AlertModal
					visible={alertVisible}
					icon={{ name: 'exclamation', color: tw.color('slate-100'), size: 36 }}
					iconStyle={{ backgroundColor: tw.color('red-500') }}
					onDismiss={hideAlert}
				>
					<View style={tw`py-4 flex-col`}>
						<Text style={tw`font-bold text-xl pb-4 text-center`}>This action will reset your app</Text>
						<Text style={tw`text-base text-gray-700`}>
							All records will be removed, this action cannot be undone. Are you sure you want to reset your app.
						</Text>
					</View>

					<View style={tw`flex-row pt-1 justify-between`}>
						<Button mode="outlined" textColor={tw.color('gray-500')} style={tw`border-gray-500`} onPress={hideAlert}>
							{i18n.t('button:label:no:cancel')}
						</Button>
						<Button mode="contained" textColor="white" buttonColor={tw.color('red-600')} onPress={onResetApp}>
							Yes, I am sure
						</Button>
					</View>
				</AlertModal>
			</Content>
		</AuthScreen>
	)
}
