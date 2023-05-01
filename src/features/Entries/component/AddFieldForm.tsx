import { i18n } from '@src/app/locale'
import { FieldType } from '@src/common/enums'
import { generateUID } from '@src/common/utils'
import DropDownList from '@src/components/DropDownList'
import { useState } from 'react'
import { View } from 'react-native'
import { Button, Text, TextInput as PaperTextInput } from 'react-native-paper'
import tw from 'twrnc'

export default function AddFieldForm({ onAddField }: { onAddField: (fieldType: OPM.Field) => void }) {
	const formFieldTypes = [
		{ label: 'Text', value: FieldType.TextInput },
		{ label: 'Password', value: FieldType.Password },
		{ label: 'Paragraph', value: FieldType.TextArea },
		{ label: 'Date', value: FieldType.DateInput }
	]

	const [fieldType, setFieldType] = useState<FieldType | null>(null)
	const [fieldLabel, setFieldLabel] = useState('')

	type ValidationErrors = Record<FormValidationFields, boolean>
	const [formValidationErrors, setFormValidationErrors] = useState<ValidationErrors>({} as ValidationErrors)

	enum FormValidationFields {
		ALL = 'ALL',
		Label = 'Label',
		Value = 'Value'
	}

	function onAdd() {
		if (onFormValidation(FormValidationFields.ALL, fieldType)) {
			const field: OPM.Field = { id: generateUID(), fieldType, label: fieldLabel }
			onAddField(field)
		}
	}

	function onFormValidation(formField: FormValidationFields, fieldType: unknown): fieldType is string {
		let valid = true
		setFormValidationErrors(o => {
			const updated: Record<string, boolean> = {}
			if (formField === FormValidationFields.Label) {
				updated[formField] = fieldType !== null && fieldLabel.trim().length === 0
			} else if (formField === FormValidationFields.Value) {
				updated[formField] = fieldLabel.trim().length !== 0 && fieldType === null
			} else {
				if (fieldLabel.trim().length === 0 || fieldType === null) {
					updated[FormValidationFields.Label] = true
					updated[FormValidationFields.Value] = true
					valid = false
				}
			}
			return { ...o, ...updated }
		})
		return valid
	}

	function onClear() {
		setFieldType(null)
		setFieldLabel('')
		setFormValidationErrors({} as ValidationErrors)
	}

	return (
		<>
			<View style={tw`p-2 mx-1 my-4 bg-teal-700 rounded`}>
				<Text style={tw`font-bold text-teal-100 text-4 pb-2`}>Add New Field</Text>

				<View>
					<View style={tw`py-1`}>
						<Text style={tw`text-3 font-bold text-teal-100`}>{i18n.t('entry:new:field:input:label')}</Text>
						<PaperTextInput
							dense
							mode="outlined"
							error={formValidationErrors[FormValidationFields.Label]}
							value={fieldLabel}
							onChangeText={v => {
								onFormValidation(FormValidationFields.Label, fieldType)
								setFieldLabel(v)
							}}
						/>
					</View>

					<View>
						<Text style={tw`text-3 font-bold text-teal-100`}>{i18n.t('entry:new:field:input:type:label')}</Text>
						{/* <PaperTextInput dense mode="outlined" contentStyle={tw`border-0 px-2`} /> */}
						<DropDownList
							placeholder={i18n.t('entry:new:field:select:type:label')}
							items={formFieldTypes}
							value={fieldType}
							setValue={setFieldType}
							disableBorderRadius={true}
							containerStyle={tw.style({ zIndex: 50 })}
							placeholderStyle={tw.style(formValidationErrors[FormValidationFields.Value] && `text-red-500`)}
						/>
					</View>
				</View>

				<View style={tw`flex-row justify-end p-1`}>
					<Button mode="elevated" style={tw`m-1`} onPress={onClear}>
						{i18n.t('button:label:clear')}
					</Button>
					<Button mode="elevated" style={tw`m-1`} onPress={onAdd}>
						{i18n.t('button:label:add')}
					</Button>
				</View>
			</View>
		</>
	)
}
