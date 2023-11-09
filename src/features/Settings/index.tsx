import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Text, Searchbar, List, Switch } from 'react-native-paper'
import * as ScreenCapture from 'expo-screen-capture'

import { i18n } from '@src/app/locale'
import tw from 'twrnc'
import AuthScreen from '@src/components/AuthScreen'

import Content from '@src/components/Content'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { ParamListBase, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserSettings, setAllowCopy, setAllowScreenCapture } from '@store/slices/settingSlice'

export default function Settings() {
	const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>()
	const dispatch = useDispatch()
	const { allowCopy, allowScreenCapture } = useSelector(selectUserSettings)

	console.log('Settings: allowCopy', allowCopy)

	function navigateTo({ screen, params = {} }: { screen: string; params?: object }) {
		// navigation.navigate('App', { screen: 'SettingsStack', params: { screen: screen, params: params } })
		navigation.navigate({ name: screen, params: params })
	}

	const [showOptions, setShowOptions] = useState({ screenCapture: false })
	const [isAllowCopy, setIsAllowCopy] = useState(allowCopy)
	const [isAllowScreenCapture, setIsAllowScreenCapture] = useState(allowScreenCapture)

	useEffect(() => {
		console.log('settings:init............')
		const init = async () => {
			const avail = await ScreenCapture.isAvailableAsync()
			console.log('avail', avail)
			setShowOptions(o => ({ ...o, screenCapture: avail }))
			setIsAllowCopy(allowCopy)
		}
		init()
	}, [])

	// useEffect(() => {
	// 	setIsAllowCopy(allowCopy)
	// }, [allowCopy])

	const onToggleAllowCopy = () => {
		const allow = !isAllowCopy
		setIsAllowCopy(allow)
		dispatch(setAllowCopy(allow))
	}

	const onToggleAllowScreenCapture = async () => {
		const allow = !isAllowScreenCapture
		setIsAllowScreenCapture(allow)
		dispatch(setAllowScreenCapture(allow))
	}

	return (
		<AuthScreen>
			<Content horizontal={false}>
				<View style={tw`flex justify-center`}>
					<List.Section>
						<List.Subheader>{i18n.t('settings.subheader.general')}</List.Subheader>
						<List.Item
							title="Testing"
							left={props => <List.Icon {...props} icon="help" />}
							onPress={() => navigateTo({ screen: 'Settings:Testing' })}
						/>
						<List.Item title="Theme mode" left={props => <List.Icon {...props} icon="theme-light-dark" />} />
						<List.Item title="Change theme" left={props => <List.Icon {...props} icon="palette" />} />
						<List.Item title="Language" left={props => <List.Icon {...props} icon="globe-model" />} />
						<List.Item
							title="Hide Password"
							description={'Password will be masked and will only be shown when you click on the eye icon'}
							left={props => <List.Icon {...props} icon="eye-off" />}
						/>
						<List.Item
							title={`Show copy buttons : ${isAllowCopy}`}
							left={props => <List.Icon {...props} icon="content-copy" />}
							right={() => <Switch value={isAllowCopy} onValueChange={onToggleAllowCopy} />}
						/>
					</List.Section>

					<List.Section>
						<List.Subheader>Backup and Export</List.Subheader>

						<List.Item
							title="Export to CSV"
							description={'Exports your entries to csv file'}
							left={props => <List.Icon {...props} icon="microsoft-excel" />}
							onPress={() => navigateTo({ screen: 'Settings:ExportCSV' })}
						/>
						<List.Item
							title="Import"
							description={
								'Imports and restores a valid backup file into the app. The current entries will be overwritten.'
							}
							left={props => <List.Icon {...props} icon="import" />}
						/>
					</List.Section>

					<List.Section>
						<List.Subheader>{`Security`}</List.Subheader>
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
						<List.Item
							title="Biometrics"
							description={'Use biometrics (fingerprint/face recognition) to login for biometric supported'}
							left={props => <List.Icon {...props} icon="fingerprint" />}
						/>
						<List.Item
							title="Auto-lock"
							description={'Lock app automatically after a certain interval in the background'}
							left={props => <List.Icon {...props} icon="lock-clock" />}
						/>
						<List.Item
							title="Manually reset app and removes all entries"
							description={'Removes all entries and reset the app. This action cannot be undone.'}
							left={props => <List.Icon {...props} icon="delete-forever" />}
						/>
					</List.Section>
				</View>
			</Content>
		</AuthScreen>
	)
}
