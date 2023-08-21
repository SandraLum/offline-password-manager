import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import * as Templates from '@src/common/templates/index'

import { CategoryType } from '@src/common/enums'
import { OPMTypes } from '@src/common/types'
import { RootState } from '@src/store'

// Custom categories -
const defaultCategories: OPMTypes.Category[] = ([] as OPMTypes.TemplateCategory[]).concat(Templates.Categories)

const categoriesAdapter = createEntityAdapter<OPMTypes.Category>({
	// Assume IDs are stored in a field other than `category.id`
	selectId: (category: OPMTypes.ICategory) => category.type
	// Keep the "all IDs" array sorted based on category sort prop
	// sortComparer: (a, b) => a.sort - b.sort
})

const initialState = categoriesAdapter.upsertMany(categoriesAdapter.getInitialState(), defaultCategories)

const categoriesSlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		categoriesAddOne: categoriesAdapter.addOne,
		categoriesAddMany: categoriesAdapter.addMany,
		categoryUpdate: categoriesAdapter.updateOne,
		categoryRemove: categoriesAdapter.removeOne,
		resetCategories: state => {
			categoriesAdapter.removeAll(state)
			return categoriesAdapter.upsertMany(categoriesAdapter.getInitialState(), defaultCategories)
		}
	}
})

export const { selectAll: selectAllCategories, selectById: selectCategoryByType } = categoriesAdapter.getSelectors(
	(state: RootState) => state.main.categories
)

// export const selectAllCategoriesDetails = createSelector([selectAllCategories], (categories): OPMTypes.Category[] => {
// 	return categories.map((c: OPMTypes.ICategory) => {
// 		return { ...c, ...Templates.Categories[c.type] }
// 	})
// })

// SL TODO:
// export const selectCategoryDetailById = createSelector(
// 	[state => state, (_, type) => type],
// 	(state, type): OPMTypes.Category | undefined => {
// 		const category = selectCategoryByType(state, type)
// 		if (category) {
// 			return { ...category, ...Templates.Categories[category.type] }
// 		} else {
// 			return Object.entries(Templates.Categories).filter(c=> c.type === type)
// 		}
// 	}
// )

export const { categoriesAddOne, categoriesAddMany, categoryUpdate, categoryRemove, resetCategories } =
	categoriesSlice.actions
export { CategoryType }
export default categoriesSlice
