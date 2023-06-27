import { createSlice } from '@reduxjs/toolkit'

import { RootState } from '..'

type Auth = {
	mkTag: string | null
	eMKV: string | null
}

const initialState: Auth = {
	mkTag: null,
	eMKV: null
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setEMKV: (state, action) => {
			state.eMKV = action.payload
		},
		setMkTag: (state, action) => {
			state.mkTag = action.payload
		}
	}
})

export const redirectScreen = (state: RootState) => {
	let screen: string
	if (state.app.mkTag && state.app.eMKV) {
		screen = 'Login'
	} else {
		screen = 'SetMasterPassword'
	}
	return screen
}

export const { setEMKV, setMkTag } = authSlice.actions
export default authSlice
