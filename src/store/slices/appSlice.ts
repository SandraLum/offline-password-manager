/* eslint-disable indent */
import { createSlice } from '@reduxjs/toolkit'
import { OPMTypes } from '@src/common/types'
import { resetProfiles, selectAllProfiles, selectProfileById } from '@src/store/slices/profilesSlice'

import { RootState } from '..'
import { clearSecureData } from './secureSlice'

type App = {
	currentProfile: { id?: OPMTypes.Profile['id'] }
	onboarded: boolean
	version: number | string
	createdTs: number
	lastUpdatedTs: number
}

const initialState: App = {
	currentProfile: {},
	onboarded: false,
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
	if (state.main.app.createdTs === 0) {
		dispatch(setCreatedTs())
	}
}

export const syncCurrentProfile: OPMTypes.AppThunk = (dispatch, getState) => {
	const state = getState()

	const currentProfileId = getCurrentProfileId(state)
	const profile = selectProfileById(state, currentProfileId)
	if (profile) {
		dispatch(setCurrentProfile({ profile: profile }))
	}
}

export const reset = (): OPMTypes.AppThunk => (dispatch, getState) => {
	dispatch(resetProfiles)

	const state = getState()
	const defaultProfile = selectAllProfiles(state)?.[0]
	if (defaultProfile) {
		dispatch(setCurrentProfile({ profile: defaultProfile }))
	}
}

export const factoryReset = (): OPMTypes.AppThunk => async dispatch => {
	console.log('FACTORY RESET APP.............')
	dispatch({ type: 'RESET_APP' })
	await clearSecureData()
}

export const restoreState =
	(retrieveState: any): OPMTypes.AppThunk =>
	async dispatch => {
		console.log('RESTORE STATE.............', retrieveState)
		// - decrypt the data
		// - Check the version of the data
		// - Check if migration scripts needs to be run
		// - Clear the existing data
		//		- profiles
		//		- entries
		//		- settings
		//		- categories
		//		- appSlice => currentProfile: { id?: OPMTypes.Profile['id'] }
		// - Insert profile first
		// - Insert entries

		// dispatch({ type: 'RESET_APP' })
		// await clearSecureData()
	}

export const selectCurrentProfile = (state: RootState) => {
	return selectProfileById(state, state.main.app.currentProfile.id)
}

export const getCurrentProfileId = (state: RootState) => state.main.app.currentProfile.id

export const { setCreatedTs, setLastUpdatedTs, setCurrentProfile } = appSlice.actions
export default appSlice
