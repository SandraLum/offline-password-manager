import { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { RootState } from '@src/store'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { FileInfo } from 'expo-file-system/build/FileSystem.types'

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
		type: 'csv'
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
		type: 'csv'
		success: false
		error: string
		profile: Profile
	}

	type ExportOPMError = {
		type: 'opm'
		success: false
		error: string
	}

	type ExportedFile = {
		id: number | string
	} & (ExportCSVData | ExportOPMData | ExportCSVError | ExportOPMError)

	type ExportedFiles = {
		type: 'csv' | 'opm'
		files: ExportedFile[]
	}

	export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>
}
