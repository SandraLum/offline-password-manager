import { createSlice } from '@reduxjs/toolkit'
import { OPMTypes } from '@src/common/types'
import { selectAllProfiles, selectProfileById } from '@src/features/Profile/profilesSlice'

import { RootState } from '..'

const initialState = {
	currentProfile: {},
	version: 0,
	lastUpdatedTs: 0
}

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		updateLastUpdatedTs: state => {
			state.lastUpdatedTs = new Date().valueOf()
		},
		_initialize: (state, action) => {
			const _profile = action.payload.profile
			if (_profile) {
				state.currentProfile = { id: _profile?.id }
			}
			state.lastUpdatedTs = new Date().valueOf()
		}
	}
})

export const initialize: OPMTypes.AppThunk = (dispatch, getState) => {
	const state = getState()
	const _profile = selectAllProfiles(state)?.[0]
	dispatch(_initialize({ profile: _profile }))
}

export const selectCurrentProfile = (state: RootState) => {
	return selectProfileById(state, state.main.app.currentProfile.id)
}

export const { updateLastUpdatedTs, _initialize } = appSlice.actions
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
