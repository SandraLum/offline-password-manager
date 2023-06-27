/* eslint-disable indent */
import { createEntityAdapter, createSlice, createSelector, AnyAction } from '@reduxjs/toolkit'
import { selectAllCategories } from '../Categories/categoriesSlice'
import { getObjValue, union } from '@utils'
import { RootState } from '@src/store'
// import { CategoryType } from '@common/enums'
import { OPMTypes } from '@src/common/types'
import { profileUpdate, selectProfileById } from '../Profile/profilesSlice'
import { selectCurrentProfile } from '@src/store/slices/appSlice'

// Model:
// const model = {
// 	id: util.generateUID(),
// 	category: { type: category.type },
// 	title,
// 	fields,
// 	fieldsOptions,
// 	fieldsValues
// }

export const defaultEntry: OPMTypes.Entry = {
	id: '',
	title: { name: '' },
	// category: { id: '', name: '', type: CategoryType.AllItems },
	// SL Todo: clean up
	category: { id: '' },
	fields: [],
	fieldsValues: {},
	lastUpdatedOn: new Date().valueOf()
}

const defaultEntries: OPMTypes.Entry[] = []
const entriesAdapter = createEntityAdapter<OPMTypes.Entry>({
	selectId: entry => entry.id || '',
	sortComparer: (a, b) => new Date(b.lastUpdatedOn).valueOf() - new Date(a.lastUpdatedOn).valueOf()
})

const initialState = entriesAdapter.upsertMany(entriesAdapter.getInitialState(), defaultEntries)

const entriesSlice = createSlice({
	name: 'entries',
	initialState,
	reducers: {
		entriesAddOne: entriesAdapter.addOne,
		entriesAddMany: entriesAdapter.addMany,
		entryUpdate: entriesAdapter.updateOne,
		entryRemove: entriesAdapter.removeOne
	}
})

// export const selectEntriesByCategory = createSelector(
// 	[state => state.entries, (state, category) => category],
// 	(items, category) => items.filter(item => item.category?.id === category?.id)
// )

export const { selectAll: selectAllEntries, selectById: selectEntryById } = entriesAdapter.getSelectors(
	(state: RootState) => state.entries
)

export const entriesAddOneToCurrentProfile =
	(entry: OPMTypes.Entry): OPMTypes.AppThunk =>
	(dispatch, getState) => {
		const state = getState()
		const { id: entryId } = entry

		const currentProfile = selectCurrentProfile(state)
		if (currentProfile) {
			dispatch(entriesAddOne(entry))
			const updatedEntries: string[] = union(currentProfile.entries || [], entryId)
			dispatch(profileUpdate({ id: currentProfile.id, changes: { entries: updatedEntries } }))
		}
	}

export const entryRemoveFromCurrentProfile =
	(id: OPMTypes.Entry['id']): OPMTypes.AppThunk =>
	(dispatch, getState) => {
		const state = getState()

		const currentProfile = selectCurrentProfile(state)
		if (currentProfile) {
			dispatch(entryRemove(id))
			if (currentProfile.entries?.length) {
				const updatedEntries: string[] = currentProfile.entries.filter(e => e !== id)
				dispatch(profileUpdate({ id: currentProfile.id, changes: { entries: updatedEntries } }))
			}
		}
	}

export const syncEntriesAndProfile =
	(id: OPMTypes.Profile['id']): OPMTypes.AppThunk =>
	(dispatch, getState) => {
		const state = getState()

		const entries = selectAllEntries(state)
		const entryIds = entries.reduce((a: string[], c) => [...a, c.id], [])

		const profile = selectProfileById(state, id)
		if (profile) {
			dispatch(profileUpdate({ id: profile.id, changes: { entries: entryIds } }))
		}
	}

export const selectAllEntriesByProfile = createSelector(
	[selectAllEntries, (state, profileId) => selectProfileById(state, profileId)],
	(entries, profile): OPMTypes.Entry[] => {
		let filtered: OPMTypes.Entry[] = []
		if (profile?.entries) {
			filtered = entries.filter(e => profile?.entries?.includes(e.id))
		}
		return filtered
	}
)

export type GroupEntry = {
	category: OPMTypes.ICategory
	entries: Omit<OPMTypes.Entry, 'category'>[]
}

export const selectAllGroupedEntriesByProfile = createSelector(
	[selectAllEntries, selectAllCategories, (state, profileId) => selectProfileById(state, profileId)],
	(items, categories, profile): GroupEntry[] => {
		const groupedIndexes: { [key: string | number]: number } = {}
		return items.reduce((arr: GroupEntry[], curr) => {
			if (profile?.entries?.includes(curr.id)) {
				const groupedKey = getObjValue(curr, 'category.id')
				if (groupedKey !== undefined) {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { category, ...entry } = curr
					const index = groupedIndexes[groupedKey]
					if (index === undefined) {
						const foundCategory = categories.find(c => c.id === curr.category.id)
						if (!foundCategory) throw 'Category not found'

						//New group
						arr.push({ category: foundCategory, entries: [entry] })
						groupedIndexes[groupedKey] = arr.length - 1
					} else {
						arr[index].entries.push(entry)
					}
				}
			}
			return arr
		}, [])
	}
)

export const selectAllGroupedEntries = createSelector(
	[selectAllEntries, selectAllCategories],
	(items, categories): GroupEntry[] => {
		const groupedIndexes: { [key: string | number]: number } = {}
		return items.reduce((arr: GroupEntry[], curr) => {
			const groupedKey = getObjValue(curr, 'category.id')
			if (groupedKey !== undefined) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { category, ...entry } = curr
				const index = groupedIndexes[groupedKey]
				if (index === undefined) {
					const foundCategory = categories.find(c => c.id === curr.category.id)
					if (!foundCategory) throw 'Category not found'

					//New group
					arr.push({ category: foundCategory, entries: [entry] })
					groupedIndexes[groupedKey] = arr.length - 1
				} else {
					arr[index].entries.push(entry)
				}
			}
			return arr
		}, [])
	}
)

export const { entriesAddOne, entriesAddMany, entryUpdate, entryRemove } = entriesSlice.actions
export default entriesSlice
