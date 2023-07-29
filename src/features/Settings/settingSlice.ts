import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '@src/store'

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

export const { setAllowCopy, setAllowScreenCapture } = settingSlice.actions
export default settingSlice
