import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import * as Templates from '@src/common/templates/index'

import { OPMTypes } from '@src/common/types'
import { RootState } from '@src/store'

// Custom categories -
// const defaultCategories: OPMTypes.Category[] = ([] as OPMTypes.TemplateCategory[]).concat(Templates.Categories)
// const defaultCategories: OPMTypes.Category[] = []

const categoriesAdapter = createEntityAdapter<OPMTypes.Category>({
	// Assume IDs are stored in a field other than `category.id`
	selectId: (category: OPMTypes.ICategory) => category.id
	// Keep the "all IDs" array sorted based on category sort prop
	// sortComparer: (a, b) => a.sort - b.sort
})

const initialState = categoriesAdapter.upsertMany(categoriesAdapter.getInitialState(), [])

const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		categoriesAddOne: categoriesAdapter.addOne,
		categoriesAddMany: categoriesAdapter.addMany,
		categoryUpdate: categoriesAdapter.updateOne,
		categoryRemove: categoriesAdapter.removeOne,
		categoryRemoveAll: categoriesAdapter.removeAll,
		resetCategories: state => {
			categoriesAdapter.removeAll(state)
			return categoriesAdapter.upsertMany(categoriesAdapter.getInitialState(), [])
		}
	}
})

// Note: This is not the best way, temporarily creating it as selector until
// the decision to add custom category feature.
export const selectAllCategories = createSelector(
	(state: RootState) => state.main.categories,
	_ => ([] as OPMTypes.Category[]).concat(Templates.Categories)
)

export const selectCategoryById = createSelector(
	[state => state, (_, id: OPMTypes.Category['id']) => id],
	(_state, id): OPMTypes.Category => Templates.Categories.filter(c => c.id === id)?.[0]
)

export const clearCategories: OPMTypes.AppThunk = dispatch => {
	dispatch(categoryRemoveAll())
}

export const {
	categoriesAddOne,
	categoriesAddMany,
	categoryUpdate,
	categoryRemove,
	categoryRemoveAll,
	resetCategories
} = categoriesSlice.actions
export default categoriesSlice
