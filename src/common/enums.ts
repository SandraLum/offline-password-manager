export enum CategoryId {
	AllItems = '[AllItems]',
	Login = '[Login]',
	Banking = '[Banking]',
	Email = '[Email]',
	CreditCard = '[CreditCard]',
	Office = '[Office]',
	Password = '[Password]',
	School = '[School]'
}

// export enum CategoryType {
// 	AllItems = 'AllItems',
// 	Login = 'Login',
// 	Banking = 'Banking',
// 	Email = 'Email',
// 	CreditCard = 'CreditCard',
// 	Office = 'Office',
// 	Password = 'Password',
// 	School = 'School'
// }

export enum FieldType {
	TextInput = 'TextInput',
	Label = 'Label',
	DateInput = 'DateInput',
	Password = 'Password',
	TextArea = 'TextArea',
	Image = 'Image',
	File = 'File'
}

export enum EntryMode {
	READ = 'READ',
	EDIT = 'EDIT',
	NEW = 'NEW'
}

export enum ProfileMode {
	READ = 'READ',
	EDIT = 'EDIT',
	NEW = 'NEW'
}

export enum DashboardContentView {
	Categories = 1,
	Entries = 2
}

export default { FieldType, EntryMode, ProfileMode, DashboardContentView }
