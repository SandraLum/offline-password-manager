import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Alert } from 'react-native'

import tw from '@src/libs/tailwind'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

import { i18n } from '@src/app/locale'
import { selectCategoryById } from '@src/store/slices/categoriesSlice'
import {
	defaultEntry,
	entryRemoveFromCurrentProfile,
	entryUpdate,
	selectEntryById
} from '@src/store/slices/entriesSlice'
import { AppDispatch, RootState } from '@src/store'
import { OPMTypes } from '@src/common/types'
import EntryForm from './component/EntryForm'
import { EntryMode } from '@src/common/enums'
import AuthScreen from '@src/components/AuthScreen'
import EntryHeader from './component/EntryHeader'

type Props = NativeStackScreenProps<RootStackParamList, 'ViewEditEntry'>

export default function ViewEditEntry({ navigation, route }: Props) {
	const dispatch = useDispatch<AppDispatch>()
	const { data, mode: _mode = EntryMode.READ } = route.params

	const entry = useSelector((state: RootState) => selectEntryById(state, data.entry?.id))

	const category: OPMTypes.Category | undefined = useSelector((state: RootState) =>
		selectCategoryById(state, entry?.category.id || '')
	)

	const originalFields = useMemo<OPM.Field[]>(() => entry?.fields || [], [entry])

	const [mode, setMode] = useState<EntryMode>(_mode)
	const [editable, setEditable] = useState<boolean>(false)
	const [fieldsOptions, setFieldsOptions] = useState<OPM.FieldsOptions>({})
	const [fieldsValues, setFieldsValues] = useState<OPM.FieldsValues>({})
	const [fields, setFields] = useState<OPM.Field[]>(originalFields)
	const [title, setTitle] = useState<OPM.EntryTitle>(entry?.title || defaultEntry.title)

	const onUpdate = useCallback(() => {
		function onValidate(data: { category: OPMTypes.Category; title: OPM.EntryTitle }): boolean {
			let valid = true
			if (data.title.name?.length === 0) {
				valid = false
			}

			if (!valid) {
				Alert.alert(i18n.t('prompt:edit:entry:invalid:form:title'), i18n.t('prompt:edit:entry:invalid:form:message'), [
					{ text: i18n.t('button:label:ok') }
				])
			}
			return valid
		}

		if (category && entry) {
			const updatedFields = fields.map(f => {
				if (fieldsOptions[f.id]) {
					f.fieldOptions = fieldsOptions[f.id]
				}
				return f
			})

			if (onValidate({ category, title })) {
				dispatch(
					entryUpdate({
						id: entry.id,
						changes: {
							category,
							title,
							fields: updatedFields,
							fieldsValues
						}
					})
				)
				setEditable(false)
				setMode(EntryMode.READ)
			}
		}
	}, [category, dispatch, entry, fields, fieldsOptions, fieldsValues, title])

	const onDelete = useCallback(() => {
		if (entry?.id) {
			Alert.alert(i18n.t('prompt:edit:entry:delete:title'), i18n.t('prompt:edit:entry:delete:message'), [
				{
					text: i18n.t('button:label:cancel')
				},
				{
					text: i18n.t('button:label:ok'),
					onPress: () => {
						dispatch(entryRemoveFromCurrentProfile(entry.id))
					}
				}
			])
		}
	}, [dispatch, entry])

	const onCancel = useCallback(() => {
		Alert.alert(i18n.t('prompt:edit:entry:cancel:title'), i18n.t('prompt:edit:entry:cancel:message'), [
			{ text: i18n.t('button:label:cancel') },
			{
				text: i18n.t('button:label:ok'),
				onPress: () => {
					setMode(EntryMode.READ)
				}
			}
		])
	}, [])

	useEffect(() => {
		if (category && entry) {
			const _fieldsOptions: OPM.FieldsOptions = {}
			fields.forEach(f => {
				if (f.fieldOptions) {
					_fieldsOptions[f.id] = f.fieldOptions
				}
			})
			setFieldsOptions(fieldsOptions)
			setFieldsValues(entry.fieldsValues || {})
		} else {
			navigation.pop()
		}
	}, [category, entry, fields, fieldsOptions, mode, navigation])

	useEffect(() => {
		setEditable(mode === EntryMode.EDIT)
	}, [mode])

	function onChangeIcon(icon?: OPM.ComplexIcon) {
		setTitle(t => ({ ...t, icon }))
	}

	return (
		<AuthScreen headerShown={false} style={tw`flex-1`}>
			<EntryHeader
				category={category}
				entry={{ title }}
				mode={mode}
				setMode={setMode}
				onDelete={onDelete}
				onCancel={onCancel}
				onUpdate={onUpdate}
				setTitle={setTitle}
				onChangeIcon={onChangeIcon}
			/>
			<EntryForm
				editable={editable}
				entry={{ title, fieldsOptions, fieldsValues, fields }}
				setTitle={setTitle}
				setFieldsOptions={setFieldsOptions}
				setFieldsValues={setFieldsValues}
				setFields={setFields}
				onChangeIcon={onChangeIcon}
			/>
		</AuthScreen>
	)
}
