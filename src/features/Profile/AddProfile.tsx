import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Alert } from 'react-native'
import { Button } from 'react-native-paper'

import tw from 'twrnc'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

import { i18n } from '@src/app/locale'
import { OPMTypes } from '@src/common/types'

import ProfileForm from './component/ProfileForm'
import { emptyProfile, profilesAddOne } from './profilesSlice'
import { generateUID } from '@src/common/utils'
import { AppDispatch } from '@src/store'
import Screen from '@src/components/Screen'

type Props = NativeStackScreenProps<RootStackParamList, 'AddProfile'>

export default function AddProfile({ navigation }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const editable = true
	const [profile, setProfile] = useState<OPMTypes.Profile | OPMTypes.EmptyProfile>(emptyProfile)

	const onSave = useCallback(() => {
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

		if (onValidate()) {
			dispatch(profilesAddOne({ id: generateUID(), ...profile }))
			navigation.goBack()
		}
	}, [dispatch, navigation, profile])

	return (
		<Screen>
			<ProfileForm editable={editable} profile={profile} setProfile={setProfile} />

			<Button onPress={onSave} mode="contained" style={tw`m-2`}>
				{i18n.t('button:label:save')}
			</Button>
		</Screen>
	)
}
