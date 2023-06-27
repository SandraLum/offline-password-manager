import { CategoryType, FieldType } from '@common/enums'

// type IEntries = {
// 	[key<typeof CategoryType>]: OPM.TemplateEntry
// }

type Entries = {
	// [key: OPM.EnumType]?: OPM.TemplateEntry
	// [key in keyof typeof CategoryType | OPM.EnumType]?: OPM.TemplateEntry
	// [key: string]: OPM.TemplateEntry
	// in keyof typeof
	// Record<CategoryType,OPM.TemplateEntry>
}

// const FieldTypes = {
// 	Text: { type: 'string', fieldType: FieldType.TextInput },
// 	Password: { type: 'password', fieldType: FieldType.Password, fieldOptions: { secure: true } },
// 	PIN: { label: 'PIN(Numbers only)', type: 'password', fieldType: FieldType.Password, fieldOptions: { secure: true } },
// 	Note: {
// 		label: 'Note(Long Text)',
// 		type: 'textarea',
// 		fieldType: FieldType.TextInput,
// 		fieldOptions: { multiline: true }
// 	},
// 	Date: { type: 'date', fieldType: FieldType.Password, fieldOptions: { secure: true } },
// 	Image: { type: 'image', fieldType: FieldType.Password, fieldOptions: { secure: true } },
// 	File: { type: 'file', fieldType: FieldType.Password, fieldOptions: { secure: true } },
// }

const FieldTypes = {
	[FieldType.TextInput]: { isFormField: true },
	[FieldType.Password]: { isFormField: true, fieldOptions: { secure: true } },
	[FieldType.TextArea]: { isFormField: true, fieldOptions: { multiline: true } },
	[FieldType.DateInput]: { isFormField: true },
	[FieldType.Label]: { isFormField: false },
	[FieldType.Image]: { isFormField: true },
	[FieldType.File]: { isFormField: true }
}

const Entries: Record<CategoryType, OPM.TemplateEntry> = {
	[CategoryType.AllItems]: {
		fields: []
	},
	[CategoryType.Login]: {
		fields: [
			{ label: 'Username', fieldType: FieldType.TextInput },
			{
				label: 'Password',
				fieldType: FieldType.Password,
				fieldOptions: { secure: true }
			},
			{ label: 'Website', fieldType: FieldType.TextInput },
			{
				label: 'Note',
				fieldType: FieldType.TextArea
			},
			{ label: 'Created', fieldType: FieldType.Label },
			{ label: 'Last Modified On', fieldType: FieldType.Label }
		]
	},
	[CategoryType.Banking]: {
		fields: [
			{
				label: 'Account',
				fieldType: FieldType.TextInput,
				icon: 'account-tag'
			},
			{ label: 'Name', fieldType: FieldType.TextInput },
			{ label: 'Password', fieldType: FieldType.Password, fieldOptions: { secure: true } },
			{ label: 'Website', fieldType: FieldType.TextInput },
			{ label: 'Note', fieldType: FieldType.TextInput, fieldOptions: { multiline: true } },
			{ label: 'Created', fieldType: FieldType.Label },
			{ label: 'Last Modified On', fieldType: FieldType.Label }
		]
	},
	[CategoryType.Email]: {
		fields: [
			{ label: 'Account', fieldType: FieldType.TextInput },
			{ label: 'Email', fieldType: FieldType.TextInput },
			{ label: 'Password', fieldType: FieldType.Password },
			{ label: 'Website', fieldType: FieldType.TextInput },
			{ label: 'Note', fieldType: FieldType.TextInput },
			{ label: 'Created', fieldType: FieldType.Label },
			{ label: 'Last Modified On', fieldType: FieldType.Label }
		]
	},
	[CategoryType.CreditCard]: {
		fields: [
			{
				label: 'Card Number',
				fieldType: FieldType.TextInput,
				placeholder: 'xxxx-xxxx-xxxx-xxxx',
				fieldOptions: { regex: '^4[0-9]{3}(?:-[0-9]{4}){3}$' }
			},
			{ label: 'PIN', fieldType: FieldType.Password, placeholder: 'xxxxxxxxxxxx' },
			{ label: 'Card Holder Name', fieldType: FieldType.TextInput, placeholder: '' },
			{ label: 'Expiration (dd/yyyy)', fieldType: FieldType.DateInput, placeholder: 'dd/yyyy' },
			{ label: 'Valid From (dd/yyyy)', fieldType: FieldType.DateInput, placeholder: 'dd/yyyy' },
			{
				label: 'Security Code(CVV/CSC)',
				fieldType: FieldType.Password,
				placeholder: 'xxx'
			},
			{
				label: 'Note',
				fieldType: FieldType.TextArea
			},
			{ label: 'Created', fieldType: FieldType.Label },
			{ label: 'Last Modified On', fieldType: FieldType.Label }
		]
	},
	[CategoryType.Office]: {
		fields: [
			{ label: 'Office', fieldType: FieldType.TextInput },
			{ label: 'Username/ID', fieldType: FieldType.TextInput },
			{ label: 'Password', fieldType: FieldType.Password, fieldOptions: { secure: true } },
			{ label: 'Note', fieldType: FieldType.TextInput, fieldOptions: { multiline: true } },
			{ label: 'Created', fieldType: FieldType.Label },
			{ label: 'Last Modified On', fieldType: FieldType.Label }
		]
	},
	[CategoryType.Password]: {
		fields: [
			{ label: 'Label', fieldType: FieldType.TextInput },
			{ label: 'Password', fieldType: FieldType.Password, fieldOptions: { secure: true } },
			{ label: 'Note', fieldType: FieldType.TextInput, fieldOptions: { multiline: true } },
			{ label: 'Created', fieldType: FieldType.Label },
			{ label: 'Last Modified On', fieldType: FieldType.Label }
		]
	},
	[CategoryType.School]: {
		fields: [
			{ label: 'Account', fieldType: FieldType.TextInput },
			{ label: 'Password', fieldType: FieldType.Password, fieldOptions: { secure: true } },
			{ label: 'Note', fieldType: FieldType.TextInput, fieldOptions: { multiline: true } },
			{ label: 'Created', fieldType: FieldType.Label },
			{ label: 'Last Modified On', fieldType: FieldType.Label }
		]
	}
}

export { Entries, FieldType, FieldTypes }
