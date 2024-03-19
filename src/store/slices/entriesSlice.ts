/* eslint-disable indent */
import { createEntityAdapter, createSlice, createSelector } from '@reduxjs/toolkit'
import { selectAllCategories } from './categoriesSlice'
import { clone, decrypt, encrypt, getObjValue, union } from '@utils'
import { RootState } from '@src/store'
// import { CategoryType } from '@common/enums'
import { OPMTypes } from '@src/common/types'
import { profileUpdate, selectProfileById } from './profilesSlice'
import { selectCurrentProfile } from '@src/store/slices/appSlice'
import { CategoryId } from '@src/common/enums'

// Model:
// const model = {
// 	id: util.generateUID(),
// 	category: { id: category.id },
// 	title,
// 	fields,
// 	fieldsOptions,
// 	fieldsValues
// }

export const defaultEntry: OPMTypes.Entry = {
	id: '',
	title: { name: '' },
	category: { id: CategoryId.Login },
	favourite: false,
	fields: [],
	fieldsValues: {},
	lastUpdatedOn: new Date().valueOf()
}

const defaultEntries: OPMTypes.Entry[] = []
const entriesAdapter = createEntityAdapter<OPMTypes.Entry>({
	selectId: entry => entry.id || '',
	sortComparer: (a, b) => {
		if (a.favourite === b.favourite) {
			return new Date(b.lastUpdatedOn).valueOf() - new Date(a.lastUpdatedOn).valueOf()
		} else {
			return (b.favourite ? 1 : 0) - (a.favourite ? 1 : 0)
		}
	}
})

const initialState = entriesAdapter.upsertMany(entriesAdapter.getInitialState(), defaultEntries)

const entriesSlice = createSlice({
	name: 'entries',
	initialState,
	reducers: {
		entriesAddOne: (state, action) => {
			entriesAdapter.addOne(state, action)
		},
		entriesAddMany: entriesAdapter.addMany,
		entriesSetAll: entriesAdapter.setAll,
		entryUpdate: entriesAdapter.updateOne,
		entryRemove: entriesAdapter.removeOne,
		entryRemoveAll: entriesAdapter.removeAll
	}
})

// export const selectEntriesByCategory = createSelector(
// 	[state => state.main.entries., (state, category) => category],
// 	(items, category) => items.filter(item => item.category?.id === category?.id)
// )

export const { selectAll: selectAllEntries, selectById: selectEntryById } = entriesAdapter.getSelectors(
	(state: RootState) => state.main.entries
)

export const clearEntries: OPMTypes.AppThunk = dispatch => {
	dispatch(entryRemoveAll())
}

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

export const selectAllFavouritedEntriesByProfile = createSelector(
	[selectAllEntries, (state, profileId) => selectProfileById(state, profileId)],
	(entries, profile): OPMTypes.Entry[] => {
		let filtered: OPMTypes.Entry[] = []
		if (profile?.entries) {
			filtered = entries.filter(e => profile?.entries?.includes(e.id) && e.favourite === true)
		}
		return filtered
	}
)

export const syncEntriesWithNewKey =
	(oldPwd: string, pwd: string): OPMTypes.AppThunk =>
	(dispatch, getState) => {
		try {
			const state = getState()
			const entries = clone(selectAllEntries(state))

			if (entries.length > 0) {
				entries.forEach((entry: OPMTypes.Entry) => {
					Object.keys(entry?.fieldsValues || {}).forEach(k => {
						if (entry.fieldsValues?.[k]) {
							const val = entry.fieldsValues[k]
							const eVal = encrypt(decrypt(val, oldPwd), pwd)
							entry.fieldsValues[k] = eVal
						}
					})
				})

				dispatch(entriesSetAll(entries))
			}
		} catch (e) {
			throw 'Error syncing entries upon change k'
		}
	}

export type GroupEntry = {
	category: OPMTypes.Category
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

export const { entriesAddOne, entriesAddMany, entriesSetAll, entryUpdate, entryRemove, entryRemoveAll } =
	entriesSlice.actions
export default entriesSlice
