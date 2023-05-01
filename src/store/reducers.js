import appSlice from '@store/slices/appSlice'
import secureSlice from '@store/slices/secureSlice'
import categoriesSlice from '@src/features/Categories/categoriesSlice'
import entriesSlice from '@src/features/Entries/entriesSlice'
import profilesSlice from '@src/features/Profile/profilesSlice'

export const mainReducer = {
	app: appSlice.reducer,
	categories: categoriesSlice.reducer,
	entries: entriesSlice.reducer,
	profiles: profilesSlice.reducer
}

export const secureReducer = {
	secure: secureSlice.reducer
}
