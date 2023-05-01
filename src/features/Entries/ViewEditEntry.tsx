import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Alert } from 'react-native'
import { Text, IconButton } from 'react-native-paper'

import tw from 'twrnc'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '@src/app/routes'

import { i18n } from '@src/app/locale'
import { selectCategoryById } from '@src/features/Categories/categoriesSlice'
import { defaultEntry, entryRemove, entryUpdate, selectEntryById } from '@src/features/Entries/entriesSlice'
import { RootState } from '@src/store'
import { OPMTypes } from '@src/common/types'
import EntryForm from './component/EntryForm'
import { EntryMode } from '@src/common/enums'
import IconInitialsBadge from '@src/components/IconInitialsBadge'

type Props = NativeStackScreenProps<RootStackParamList, 'ViewEditEntry'>

export default function ViewEditEntry({ navigation, route }: Props) {
	const dispatch = useDispatch()
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
						dispatch(entryRemove(entry.id))
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
		if (category) {
			navigation.setOptions({
				headerTitle: () => (
					<View style={tw`flex-row items-center `}>
						<IconInitialsBadge icon={category.icon} size={24} />
						<Text style={tw.style(`pl-2 text-6 font-bold`)}>{category.name}</Text>
					</View>
				),
				headerRight: () => {
					let headerButtons
					switch (mode) {
						case EntryMode.READ:
							headerButtons = (
								<View style={tw`flex flex-row`}>
									<IconButton icon="star-outline" onPress={() => console.log('Fav pressed')} />
									<IconButton icon="pencil" mode="contained" onPress={() => setMode(EntryMode.EDIT)} />
									<IconButton icon="delete" onPress={onDelete} />
								</View>
							)
							break
						case EntryMode.EDIT:
							headerButtons = (
								<View style={tw`flex flex-row`}>
									<IconButton icon="star-outline" onPress={() => console.log('Fav pressed')} />
									<IconButton icon="content-save" mode="contained" onPress={onUpdate} />
									<IconButton icon="close" iconColor={tw.color('gray-400')} onPress={onCancel} />
								</View>
							)
							break
					}
					return headerButtons
				}
			})
		}
	}, [category, mode, navigation, onDelete, onUpdate, onCancel])

	useEffect(() => {
		setEditable(mode === EntryMode.EDIT)
	}, [mode])

	function onChangeIcon(icon: OPM.Icon) {
		setTitle(t => ({ ...t, icon }))
	}

	return (
		<>
			<EntryForm
				editable={editable}
				entry={{ title, fieldsOptions, fieldsValues, fields }}
				setTitle={setTitle}
				setFieldsOptions={setFieldsOptions}
				setFieldsValues={setFieldsValues}
				setFields={setFields}
				onChangeIcon={onChangeIcon}
			/>
		</>
	)
}
