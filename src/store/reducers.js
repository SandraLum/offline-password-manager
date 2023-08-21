import appSlice from '@store/slices/appSlice'
import secureSlice from '@src/store/slices/secureSlice'
import authSlice from '@src/store/slices/authSlice'
import categoriesSlice from '@src/store/slices/categoriesSlice'
import entriesSlice from '@src/store/slices/entriesSlice'
import profilesSlice from '@src/store/slices/profilesSlice'
import settingSlice from '@src/store/slices/settingSlice'

export const mainReducer = {
	app: appSlice.reducer,
	auth: authSlice.reducer,
	categories: categoriesSlice.reducer,
	entries: entriesSlice.reducer,
	profiles: profilesSlice.reducer,
	setting: settingSlice.reducer
}

export const secureReducer = secureSlice.reducer
