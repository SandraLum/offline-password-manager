import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit'

import * as Templates from '@src/common/templates/index'

import { CategoryType } from '@src/common/enums'
import { OPMTypes } from '@src/common/types'
import { RootState } from '@src/store'
import { generateUID } from '@utils'

const defaultCategories: OPMTypes.ICategory[] = [
	{
		// All Items has a designated id
		id: '[ALLITEM]',
		type: CategoryType.AllItems,
		// ...Templates.Categories[CategoryType.AllItems],
		sort: 0
	},
	{
		id: generateUID(),
		type: CategoryType.Login,
		// ...Templates.Categories[CategoryType.Login],
		sort: 1
	},
	{
		id: generateUID(),
		type: CategoryType.Banking,
		// ...Templates.Categories[CategoryType.Banking],
		sort: 2
	},
	{
		id: generateUID(),
		type: CategoryType.CreditCard,
		// ...Templates.Categories[CategoryType.CreditCard],
		sort: 3
	},
	{
		id: generateUID(),
		type: CategoryType.Email,
		// ...Templates.Categories[CategoryType.Email],
		sort: 4
	},
	{
		id: generateUID(),
		...Templates.Categories[CategoryType.Office],
		sort: 5
	},
	{
		id: generateUID(),
		type: CategoryType.School,
		// ...Templates.Categories[CategoryType.School],
		sort: 5
	}
]

const categoriesAdapter = createEntityAdapter<OPMTypes.ICategory>({
	// Assume IDs are stored in a field other than `category.id`
	selectId: (category: OPMTypes.ICategory) => category.id,
	// Keep the "all IDs" array sorted based on category sort prop
	sortComparer: (a, b) => a.sort - b.sort
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

export const { selectAll: selectAllCategories, selectById: selectCategoryById } = categoriesAdapter.getSelectors(
	(state: RootState) => state.main.categories
)

export const selectAllCategoriesDetails = createSelector([selectAllCategories], (categories): OPMTypes.Category[] => {
	return categories.map((c: OPMTypes.ICategory) => {
		return { ...c, ...Templates.Categories[c.type] }
	})
})

export const selectCategoryDetailById = createSelector(
	[selectCategoryById],
	(category): OPMTypes.Category | undefined => {
		if (category) {
			return { ...category, ...Templates.Categories[category.type] }
		}
	}
)

export const { categoriesAddOne, categoriesAddMany, categoryUpdate, categoryRemove, resetCategories } =
	categoriesSlice.actions
export { CategoryType }
export default categoriesSlice
