import { useState, useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Alert } from 'react-native'
import { Text, Button } from 'react-native-paper'

import tw from 'twrnc'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

import { i18n } from '@src/app/locale'
import { OPMTypes } from '@src/common/types'
import { ProfileMode } from '@src/common/enums'

import ProfileForm from './component/ProfileForm'
import AlertModal from '@src/components/AlertModal'
import { selectProfileById, profileUpdate, emptyProfile } from './profilesSlice'
import { getCurrentProfileId, syncCurrentProfile } from '@src/store/slices/appSlice'
import { AppDispatch } from '@src/store'
import Container from '@src/components/Container'
import Content from '@src/components/Content'

type Props = NativeStackScreenProps<RootStackParamList, 'ViewAndEditProfile'>

export default function ViewAndEditProfile({ navigation, route }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const { data, mode = ProfileMode.EDIT } = route.params

	const currentProfileId = useSelector(getCurrentProfileId)
	const originalProfile: OPMTypes.Profile | undefined = useSelector(state => selectProfileById(state, data.profile.id))

	const [profile, setProfile] = useState<OPMTypes.Profile | OPMTypes.EmptyProfile>(originalProfile || emptyProfile)
	const showAlert = () => setAlertVisible(true)
	const hideAlert = () => setAlertVisible(false)
	const [alertVisible, setAlertVisible] = useState(false)

	const editable = useMemo(() => mode === ProfileMode.EDIT, [mode])

	const onUpdate = useCallback(() => {
		function onValidate(): boolean {
			let valid = true
			if (profile?.name.length === 0) {
				valid = false
				Alert.alert(
					i18n.t('prompt:edit:profile:invalid:form:title'),
					i18n.t('prompt:edit:profile:invalid:form:message'),
					[{ text: i18n.t('button:label:ok') }]
				)
			}
			return valid
		}

		if (profile.id && onValidate()) {
			dispatch(profileUpdate({ id: profile.id, changes: { ...profile } }))
			if (currentProfileId === profile.id) {
				dispatch(syncCurrentProfile)
			}
			navigation.goBack()
		}
	}, [currentProfileId, dispatch, navigation, profile])

	const onDelete = useCallback(() => {
		if (originalProfile?.id) {
			showAlert()
		}
	}, [originalProfile?.id])

	if (!profile.id) return null

	return (
		<Container>
			<Content contentContainerStyle={tw`h-full`} horizontal={false}>
				<ProfileForm editable={editable} profile={profile} setProfile={setProfile} />

				<>
					<Button onPress={onUpdate} mode="contained" style={tw`m-2`}>
						{i18n.t('button:label:save')}
					</Button>
					<Button onPress={onDelete} mode="outlined" style={tw`m-2 border-gray-400`} textColor={tw.color('red-500')}>
						{i18n.t('button:label:delete:profile')}
					</Button>
				</>
			</Content>

			<AlertModal
				visible={alertVisible}
				icon={{ name: 'delete', color: 'white', size: 36 }}
				iconStyle={{ backgroundColor: tw.color('red-500') }}
				onDismiss={hideAlert}
			>
				<View style={tw`py-4 flex-col`}>
					<Text style={tw`font-bold text-2xl pb-4 self-center`}>{i18n.t('prompt:edit:profile:delete:title')}</Text>
					<Text style={tw`text-base text-gray-700`}>
						{i18n.t('prompt:profile:form:delete:profile:message', { profilename: profile.name })}
					</Text>
					<Text style={tw`text-sm text-gray-500 pt-6`}>{i18n.t('prompt:profile:form:delete:profile:note')}</Text>
				</View>

				<View style={tw`flex-row pt-1 justify-between`}>
					<Button
						mode="outlined"
						textColor={tw.color('gray-500')}
						style={tw`border-gray-500 w-45/100`}
						onPress={hideAlert}
					>
						{i18n.t('button:label:cancel')}
					</Button>
					<Button mode="elevated" textColor="white" buttonColor={tw.color('red-500')} style={tw`w-45/100`}>
						{i18n.t('button:label:delete:profile')}
					</Button>
				</View>
			</AlertModal>
		</Container>
	)
}
