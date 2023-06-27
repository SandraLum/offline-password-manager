import appSlice from '@store/slices/appSlice'
import authSlice from '@store/slices/authSlice'
import secureSlice from '@store/slices/secureSlice'
import categoriesSlice from '@src/features/Categories/categoriesSlice'
import entriesSlice from '@src/features/Entries/entriesSlice'
import profilesSlice from '@src/features/Profile/profilesSlice'

export const mainReducer = {
	app: appSlice.reducer,
	auth: authSlice.reducer,
	secure: secureSlice.reducer,
	categories: categoriesSlice.reducer,
	entries: entriesSlice.reducer,
	profiles: profilesSlice.reducer
}
