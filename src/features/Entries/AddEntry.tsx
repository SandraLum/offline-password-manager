import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert, View } from 'react-native'
import { IconButton } from 'react-native-paper'

import tw from 'twrnc'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

import { i18n } from '@src/app/locale'

import * as utils from '@utils'
import { Entries as TemplateEntries } from '@src/common/templates'

import { selectCategoryById } from '@src/features/Categories/categoriesSlice'
import { defaultEntry, entriesAddOneToCurrentProfile } from '@src/features/Entries/entriesSlice'
import { AppDispatch, RootState } from '@src/store'
import EntryForm from './component/EntryForm'
import { selectCurrentProfile } from '@src/store/slices/appSlice'
import { useNavigation } from '@react-navigation/native'

import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import Container from '@src/components/Container'

type Props = NativeStackScreenProps<RootStackParamList, 'AddEntry'>

export default function AddEntry({ route }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()
	const { data } = route.params

	const category = useSelector((state: RootState) => selectCategoryById(state, data.category.id))
	const currentProfile = useSelector(selectCurrentProfile)

	const originalFields = useMemo<OPM.Field[]>(
		() =>
			category ? TemplateEntries[category.type].fields.map((f: OPM.IField) => ({ ...f, id: utils.generateUID() })) : [],
		[category]
	)

	const [editable, setEditable] = useState<boolean>(true)
	const [fieldsOptions, setFieldsOptions] = useState<OPM.FieldsOptions>({})
	const [fieldsValues, setFieldsValues] = useState<OPM.FieldsValues>({})
	const [fields, setFields] = useState<OPM.Field[]>(originalFields)
	const [title, setTitle] = useState<OPM.EntryTitle>({ ...defaultEntry.title })

	const onSave = useCallback(() => {
		if (!category) return

		dispatch(
			entriesAddOneToCurrentProfile({
				id: utils.generateUID(),
				category,
				title,
				fields,
				fieldsValues,
				lastUpdatedOn: new Date().valueOf()
			})
		)

		setEditable(false)
		navigation.pop()
	}, [category, dispatch, fields, fieldsValues, navigation, title])

	const onCancel = useCallback(() => {
		Alert.alert(i18n.t('prompt:edit:entry:cancel:title'), i18n.t('prompt:edit:entry:cancel:message'), [
			{ text: i18n.t('button:label:cancel') },
			{
				text: i18n.t('button:label:ok'),
				onPress: () => {
					navigation.goBack()
				}
			}
		])
	}, [navigation])

	// Initialize
	useEffect(() => {
		if (category) {
			setTitle(o => ({ ...o, ...{ name: category.name, icon: { color: category.icon.bgColor } } }))
		}
	}, [category])

	useEffect(() => {
		if (!category) {
			navigation.pop()
		} else {
			navigation.setOptions({
				title: category.name,
				headerRight: () => (
					<View style={tw`flex flex-row`}>
						<IconButton icon="star-outline" onPress={() => console.log('Fav pressed')} />
						<IconButton icon="content-save" mode="contained" onPress={() => onSave()} />
						<IconButton icon="close" onPress={onCancel} />
					</View>
				)
			})
		}
	}, [
		category,
		currentProfile?.avatar?.color,
		dispatch,
		fields,
		fieldsOptions,
		fieldsValues,
		navigation,
		onCancel,
		onSave
	])

	function onChangeIcon(icon?: OPM.ComplexIcon) {
		setTitle(t => ({ ...t, icon }))
	}

	return (
		<Container personalizeHeader={true}>
			<EntryForm
				editable={editable}
				entry={{ title, fieldsOptions, fieldsValues, fields }}
				setTitle={setTitle}
				setFieldsOptions={setFieldsOptions}
				setFieldsValues={setFieldsValues}
				setFields={setFields}
				onChangeIcon={onChangeIcon}
			/>
		</Container>
	)
}
