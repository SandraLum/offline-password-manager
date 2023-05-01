declare namespace OPM {
	type Map = { [key: string | number]: never }

	type Icon = {
		id?: string
		name?: string //Name for preloaded react-native-vector-icons
		path?: string //Actual image of brand icons
		bgColor?: string
		color: string | undefined
	}

	type FieldOptions = {
		secure?: boolean
		multiline?: boolean
		regex?: string
		isSecure?: boolean //SL TODO: not sure if we want to put this in EntryForm type specifically
	}

	// type FieldsValues = {
	// 	secure?: boolean
	// 	multiline?: boolean
	// }

	type FieldsOptions = {
		[key: string | number]: FieldOptions
	}

	type FieldsValues = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string | number]: any
	}

	interface IField {
		label: string
		// type: string
		fieldType: string
		icon?: string
		placeholder?: string
		fieldOptions?: FieldOptions
	}

	type Field = {
		id: string | number
	} & IField

	// type TemplateCategory = {
	// 	name: string
	// 	icon: Icon
	// 	type: EnumType
	// }

	// type ICategory = {
	// 	id: string | number
	// 	name: string
	// 	type: EnumType //EnumType: CategoryType
	// }

	// type Category = {
	// 	sort: number
	// } & TemplateCategory &
	// 	ICategory

	type EntryTitle = {
		name: string
		icon?: Icon
	}

	type TemplateEntry = {
		fields: IField[]
	}

	const enum ICategoryType {
		AllItems = 'AllItems',
		Login = 'Login',
		Banking = 'Banking',
		Email = 'Email',
		CreditCard = 'CreditCard',
		Office = 'Office',
		Password = 'Password'
	}

	// type Entry = {
	// 	id: string | undefined
	// 	title: EntryTitle
	// 	category: { id: string; type?: typeof CategoryType }
	// 	fields: Field[]
	// 	fieldsValues?: { [key: string | number]: FieldsValues }
	// 	lastUpdatedOn: Date | number
	// }
}
