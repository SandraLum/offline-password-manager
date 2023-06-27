import { createSlice } from '@reduxjs/toolkit'
import { OPMTypes } from '@src/common/types'
import { resetProfiles, selectAllProfiles, selectProfileById } from '@src/features/Profile/profilesSlice'

import { RootState } from '..'

type App = {
	currentProfile: { id?: OPMTypes.Profile['id'] }
	mkTag: string | null
	eMKV: string | null
	version: number | string
	createdTs: number
	lastUpdatedTs: number
}

const initialState: App = {
	currentProfile: {},
	mkTag: null,
	eMKV: null,
	version: 0,
	createdTs: 0,
	lastUpdatedTs: 0
}

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setCurrentProfile: (state, action) => {
			const { profile } = action.payload
			state.currentProfile = { id: profile.id }
		},
		setEMKV: (state, action) => {
			state.eMKV = action.payload
		},
		setMkTag: (state, action) => {
			state.mkTag = action.payload
		},
		setCreatedTs: state => {
			state.createdTs = new Date().getTime()
		},
		setLastUpdatedTs: state => {
			state.lastUpdatedTs = new Date().getTime()
		}
	}
})

export const initialize: OPMTypes.AppThunk = (dispatch, getState) => {
	const state = getState()

	const defaultProfile = selectAllProfiles(state)?.[0]
	if (defaultProfile && !getCurrentProfileId(state)) {
		dispatch(setCurrentProfile({ profile: defaultProfile }))
	}
	if (state.app.createdTs === 0) {
		dispatch(setCreatedTs())
	}
}

export const redirectScreen = (state: RootState) => {
	let screen: string
	if (state.app.mkTag && state.app.eMKV) {
		screen = 'Login'
	} else {
		screen = 'SetMasterPassword'
	}
	return screen
}

export const syncCurrentProfile: OPMTypes.AppThunk = (dispatch, getState) => {
	const state = getState()

	const currentProfileId = getCurrentProfileId(state)
	const profile = selectProfileById(state, currentProfileId)
	if (profile) {
		dispatch(setCurrentProfile({ profile: profile }))
	}
}

export const reset: OPMTypes.AppThunk = (dispatch, getState) => {
	dispatch(resetProfiles)

	const state = getState()
	const defaultProfile = selectAllProfiles(state)?.[0]
	if (defaultProfile) {
		dispatch(setCurrentProfile({ profile: defaultProfile }))
	}
}

export const selectCurrentProfile = (state: RootState) => {
	return selectProfileById(state, state.app.currentProfile.id)
}

export const getCurrentProfileId = (state: RootState) => state.app.currentProfile.id

export const { setCreatedTs, setLastUpdatedTs, setCurrentProfile, setEMKV, setMkTag } = appSlice.actions
export default appSlice

// // Can still subscribe to the store
// store.subscribe(() => console.log(store.getState()))

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(incremented())
// // {value: 1}
// store.dispatch(incremented())
// // {value: 2}
// store.dispatch(decremented())
// // {value: 1}
