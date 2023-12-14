import { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { RootState } from '@src/store'
import { FileInfo } from 'expo-file-system/build/FileSystem.types'
import { ParamListBase } from '@react-navigation/native'

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace OPMTypes {
	type TemplateCategory = {
		id: string
		name: string
		icon: OPM.Icon
		// type: CategoryType
	}

	type ICategory = {
		id: string
		// name: string
		// type: CategoryType
		sort?: number
	}

	type Category = TemplateCategory & ICategory

	type Categories = {
		[key: string]: TemplateCategory
		// [key: string]: Omit<OPMTypes.TemplateCategory, 'type'> & { type: CategoryType }
	}

	type Entry = {
		id: string
		title: OPM.EntryTitle
		category: { id: ICategory['id'] }
		fields: OPM.Field[]
		fieldsValues?: OPM.FieldsValues
		lastUpdatedOn: number | string
	}

	type EntryWithoutCategory = Omit<Entry, 'category'>

	type IconName<T> = keyof T

	type Profile = {
		id: string
		name: string
		description?: string
		avatar: OPM.Avatar
		entries?: string[]
	}

	type EmptyProfile = Omit<Profile, 'id'> & { id?: string }

	type ExportCSVData = {
		success: true
		profile: Profile
		filename: string
		fileUri: string
		fileInfo: FileInfo
	}

	type ExportOPMData = {
		type: 'opm'
		success: true
		filename: string
		fileUri: string
		fileInfo: FileInfo
	}

	type ExportCSVError = {
		success: false
		error: string
		profile: Profile
	}

	type ExportOPMError = {
		type: 'opm'
		success: false
		error: string
	}

	type ExportedCSVFile = {
		id: number | string
	} & (ExportCSVData | ExportCSVError)

	type ExportedFile = {
		id: number | string
	} & (ExportCSVData | ExportOPMData | ExportCSVError | ExportOPMError)

	type ExportedFiles = {
		type: 'csv' | 'opm'
		files: ExportedFile[]
	}

	type NavigationOptions<ParamList extends ParamListBase, RouteName extends keyof ParamList> =
		| { key: string; params?: ParamList[RouteName]; merge?: boolean }
		| {
				name: RouteName
				key?: string
				params: ParamList[RouteName]
				merge?: boolean
		  } // this first condition allows us to iterate over a union type

	export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>
}
