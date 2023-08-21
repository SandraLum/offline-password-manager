import { createSlice } from '@reduxjs/toolkit'
import { OPMTypes } from '@src/common/types'
import { RootState } from '@src/store'
import { getCurrentProfileId, setCurrentProfile } from '../../../_to_delete/20230705/slices.original/appSlice'
import { selectAllCategories } from './categoriesSlice'
import { selectAllEntries } from './entriesSlice'
import { selectAllProfiles, selectProfileById } from './profilesSlice'

type Setting = {
	allowCopy: boolean
	allowScreenCapture: boolean
}

const initialState: Setting = {
	allowCopy: true,
	allowScreenCapture: false
}

const settingSlice = createSlice({
	name: 'setting',
	initialState,
	reducers: {
		setAllowCopy: (state, action) => {
			state.allowCopy = action.payload
		},
		setAllowScreenCapture: (state, action) => {
			state.allowScreenCapture = action.payload
		}
	}
})

export const selectUserSettings = (state: RootState) => state.main.setting

export const getDataForExport: OPMTypes.AppThunk = (dispatch, getState) => {
	const state = getState()

	const profiles = selectAllProfiles(state)
	const items = selectAllEntries(state)
	const categories = selectAllCategories(state)

	return { profiles, items, categories }
	// return items.reduce((arr: GroupEntry[], curr) => {
	// 	if (profile?.entries?.includes(curr.id)) {
	// 		const groupedKey = getObjValue(curr, 'category.id')
	// 		if (groupedKey !== undefined) {
	// 			// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// 			const { category, ...entry } = curr
	// 			const index = groupedIndexes[groupedKey]
	// 			if (index === undefined) {
	// 				const foundCategory = categories.find(c => c.id === curr.category.id)
	// 				if (!foundCategory) throw 'Category not found'

	// 				//New group
	// 				arr.push({ category: foundCategory, entries: [entry] })
	// 				groupedIndexes[groupedKey] = arr.length - 1
	// 			} else {
	// 				arr[index].entries.push(entry)
	// 			}
	// 		}
	// 	}
	// 	return arr
	// }, [])
}

export const getBackupState: OPMTypes.AppThunk<RootState> = (dispatch, getState) => {
	return getState()
}

export const { setAllowCopy, setAllowScreenCapture } = settingSlice.actions
export default settingSlice
