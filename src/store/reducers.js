import appSlice from '@store/slices/appSlice'
import secureSlice from '@src/store/slices/secureSlice'
import authSlice from '@src/store/slices/authSlice'
import categoriesSlice from '@src/features/Categories/categoriesSlice'
import entriesSlice from '@src/features/Entries/entriesSlice'
import profilesSlice from '@src/features/Profile/profilesSlice'
import settingSlice from '@src/features/Settings/settingSlice'

export const mainReducer = {
	app: appSlice.reducer,
	auth: authSlice.reducer,
	categories: categoriesSlice.reducer,
	entries: entriesSlice.reducer,
	profiles: profilesSlice.reducer,
	setting: settingSlice.reducer
}

export const secureReducer = secureSlice.reducer
