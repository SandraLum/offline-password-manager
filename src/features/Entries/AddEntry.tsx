import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert, View } from 'react-native'
import { Text, IconButton } from 'react-native-paper'

import tw from 'twrnc'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

import { i18n } from '@src/app/locale'

import * as utils from '@utils'
import { Entries as TemplateEntries } from '@src/common/templates'

import { selectCategoryById } from '@src/features/Categories/categoriesSlice'
import { defaultEntry, entriesAddOne } from '@src/features/Entries/entriesSlice'
import { RootState } from '@src/store'
import EntryForm from './component/EntryForm'

type Props = NativeStackScreenProps<RootStackParamList, 'AddEntry'>

export default function AddEntry({ navigation, route }: Props) {
	const dispatch = useDispatch()
	const { data } = route.params

	const category = useSelector((state: RootState) => selectCategoryById(state, data.category.id))

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

		// SL: Not sure if we need this, state of eye "secure" should be just within the state
		// const updatedFields = fields.map(f => {
		// 	if (fieldsOptions[f.id]) {
		// 		f.fieldOptions = fieldsOptions[f.id]
		// 	}
		// 	return f
		// })

		dispatch(
			entriesAddOne({
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

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { name, ...iconProps } = category?.icon || {}
		const _title = category ? { name: category?.name, icon: { ...iconProps } } : {}
		setTitle(o => ({ ...o, ..._title }))
	}, [category])

	useEffect(() => {
		if (!category) {
			navigation.pop()
		} else {
			navigation.setOptions({
				headerTitle: () => (
					<View style={tw`flex flex-row`}>
						<Text style={tw.style(`flex-1 text-6 bg-transparent`, 'font-bold')}>{category.name}</Text>
					</View>
				),
				headerRight: () => (
					<View style={tw`flex flex-row`}>
						<IconButton icon="star-outline" onPress={() => console.log('Fav pressed')} />
						<IconButton icon="content-save" mode="contained" onPress={() => onSave()} />
						<IconButton icon="close" onPress={onCancel} />
					</View>
				)
			})
		}
	}, [category, dispatch, fields, fieldsOptions, fieldsValues, navigation, onCancel, onSave])

	function onChangeIcon(icon: OPM.Icon) {
		setTitle(t => ({ ...t, icon }))
	}

	return (
		<EntryForm
			editable={editable}
			entry={{ title, fieldsOptions, fieldsValues, fields }}
			setTitle={setTitle}
			setFieldsOptions={setFieldsOptions}
			setFieldsValues={setFieldsValues}
			setFields={setFields}
			onChangeIcon={onChangeIcon}
		/>
	)
}
