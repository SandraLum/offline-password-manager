import { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { CategoryType } from '@src/common/enums'
import { RootState } from '@src/store'

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace OPMTypes {
	type TemplateCategory = {
		name: string
		icon: OPM.Icon
		type: CategoryType
	}

	type ICategory = {
		id: string
		// name: string
		// type: CategoryType
	}

	type Category = {
		sort: number
	} & TemplateCategory &
		ICategory

	type Entry = {
		id: string
		title: OPM.EntryTitle
		category: ICategory
		fields: OPM.Field[]
		fieldsValues?: OPM.FieldsValues
		lastUpdatedOn: number | string
	}

	type EntryWithoutCategory = Omit<Entry, 'category'>

	type Profile = {
		id: string
		name: string
		description?: string
		avatar: { icon: { name: string }; iconStyle?: { backgroundColor: string | undefined } }
		categories?: string[]
		entries?: string[]
		// type: CategoryType
	}

	type EmptyProfile = Omit<Profile, 'id'> & { id?: string }

	export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>
}
