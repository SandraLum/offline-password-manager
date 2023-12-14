/* eslint-disable indent */
import * as Device from 'expo-device'
import { createSlice } from '@reduxjs/toolkit'
import { OPMTypes } from '@src/common/types'
import { cryptoHS, decrypt, encrypt, generateUID } from '@src/common/utils'

import { RootState } from '..'
import { encryptPassword, setSecurePassphrase, setSecureTag } from './secureSlice'
import { syncEntriesWithNewKey } from '@src/store/slices/entriesSlice'

// Authentication flow:
// - redux store contains 2 types of store: Async and Secure store
// - redux store transform secret key is stored in 'SecureStore' with a defined key

// TODO: Testing for 1min, to change to something longer
//60000 = 1min | 120000 = 2min | 900000 = 15min
export const TimeoutInterval = 60000 //900000

const initialState = {
	mk: null,
	lts: 0,
	isAuthenticated: false,
	isLoading: false
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setMK: (state, action) => {
			state.mk = action.payload
		},
		setLts: (state, action) => {
			state.lts = action.payload
		},
		resetLts: state => {
			state.lts = 0
		},
		setIsAuthenticated: (state, action) => {
			state.isAuthenticated = action.payload
		},
		setIsLoading: (state, action) => {
			state.isLoading = action.payload
		}
	}
})

// Initial set master password (once or over written upon reset)
// Set the tag [OPM-MK93sjI8@1n9%n6wee] for verification re-login
// Set the encrypted value for verification upon re-login
// Only-once
export const saveMasterPassword =
	(pwd: string): OPMTypes.AppThunk<Promise<boolean>> =>
	async (dispatch, getState) => {
		const state = getState()
		//if (state.secure.secureTag === null && state.secure.securePassphrase === null) {

		const mk = await encryptPassword(pwd, { generateNewSalt: true })
		dispatch(setMK(mk))

		const tag = '[' + generateUID() + ']'
		dispatch(setSecureTag(tag))

		const ts = cryptoHS(state.main.app.createdTs, tag)
		const eVal = encrypt(tag.concat(ts), mk)
		dispatch(setSecurePassphrase(eVal))

		return await dispatch(unlock(pwd))
		//}
	}

export const changeMasterPassword =
	(pwd: string): OPMTypes.AppThunk<Promise<boolean | undefined>> =>
	async (dispatch, getState) => {
		const state = getState()
		try {
			if (
				state.main.auth.isAuthenticated &&
				state.secure.secureTag !== null &&
				state.secure.securePassphrase !== null
			) {
				const oldKey = state.main.auth.mk
				const newKey = await encryptPassword(pwd)

				// SyncEntries
				dispatch(syncEntriesWithNewKey(oldKey, newKey))
				dispatch(setMK(newKey))

				const tag = '[' + generateUID() + ']'
				dispatch(setSecureTag(tag))

				const ts = cryptoHS(state.main.app.createdTs, tag)
				const eVal = encrypt(tag.concat(ts), newKey)
				dispatch(setSecurePassphrase(eVal))

				return await dispatch(unlock(pwd))
			}
		} catch (e) {
			throw 'Error changing password'
		}
	}

// This is to overwrite mk values
// Verify with previous decrypted value is valid before allow overwritting
// export const resetEMK =
// 	(preVal: string, key: string): OPMTypes.AppThunk =>
// 	(dispatch, getState) => {
// 		const state = getState()

// 		dispatch(setMK(key))
// 		const tag = '[' + generateUID() + ']'
// 		dispatch(setMkTag(tag))
// 		const ts = state.main.app.createdTs
// 		const eVal = encrypt(tag.concat(ts), key)
// 		dispatch(setSecurePassphrase(eVal))
// 	}

export const verifyPassword =
	(pwd: string): OPMTypes.AppThunk<Promise<{ valid: boolean; key?: string | null }>> =>
	async (_dispatch, getState) => {
		const state = getState()
		let valid = false

		const key = await encryptPassword(pwd)
		const dVal = decrypt(state.secure.securePassphrase, key)

		if (dVal.slice(0, 38) === state.secure.secureTag) {
			const arg = dVal.slice(38)
			if (arg === cryptoHS(state.main.app.createdTs, dVal.slice(0, 38))) {
				valid = true
			}
		}
		return { valid: valid, key: key }
	}

export const unlock =
	(val: string): OPMTypes.AppThunk<Promise<boolean>> =>
	async (dispatch, getState) => {
		const state = getState()
		let success = false

		const { valid, key } = await dispatch(verifyPassword(val))
		if (valid) {
			dispatch(setMK(key))
			const ts = await Device.getUptimeAsync()
			dispatch(setLts(ts))
			if (!state.main.auth.isAuthenticated) {
				dispatch(setIsAuthenticated(true))
			}
			success = true
		}
		return success
	}

export const sessionTimeLeft = (): OPMTypes.AppThunk<Promise<number>> => async (dispatch, getState) => {
	const state = getState()
	let tsSession = 0
	if (
		state.main.auth.mk !== null &&
		state.main.auth.lts !== 0 &&
		state.secure.secureTag !== null &&
		state.secure.securePassphrase !== null
	) {
		const ts = await Device.getUptimeAsync()

		const period = TimeoutInterval
		const elapsed = ts - state.main.auth.lts
		if (elapsed >= 0 && elapsed < period) {
			tsSession = period - elapsed
		}
	}
	return tsSession
}

export const invalidateSession =
	(forceLogout = false): OPMTypes.AppThunk =>
	dispatch => {
		dispatch(setMK(null))
		dispatch(resetLts())

		if (forceLogout) {
			dispatch(setIsAuthenticated(false))
		}
	}

export const checkIsSessionValid = (state: RootState) => state.main.auth.mk !== null && state.main.auth.lts !== 0

export const checkIsAuthenticated = (state: RootState) => state.main.auth.isAuthenticated

export const getMK = (state: RootState) => state.main.auth.mk

export const { setMK, setLts, resetLts, setIsLoading, setIsAuthenticated } = authSlice.actions
export default authSlice
