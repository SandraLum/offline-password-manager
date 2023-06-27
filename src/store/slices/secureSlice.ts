/* eslint-disable indent */
import * as Device from 'expo-device'
import { createSlice } from '@reduxjs/toolkit'
import { OPMTypes } from '@src/common/types'
import { cryptoHS, decrypt, encrypt, generateUID } from '@src/common/utils'

import { RootState } from '..'
import { setEMKV, setMkTag } from './appSlice'

const initialState = {
	mk: null,
	lts: 0
}

const secureSlice = createSlice({
	name: 'secure',
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
		//if (state.app.mkTag === null && state.app.eMKV === null) {
		const hsVal = cryptoHS(pwd)
		dispatch(setMK(hsVal))
		const tag = '[' + generateUID() + ']'
		dispatch(setMkTag(tag))
		// const ts = new Date().getTime().toString()
		const ts = state.app.createdTs
		const eVal = encrypt(tag.concat(ts), hsVal)
		dispatch(setEMKV(eVal))

		return await dispatch(login(pwd))
		//}
	}

// This is to overwrite mk values
// Verify with previous decrypted value is valid before allow overwritting
export const resetEMK =
	(preVal: string, hsVal: string): OPMTypes.AppThunk =>
	(dispatch, getState) => {
		const state = getState()

		dispatch(setMK(hsVal))
		const tag = '[' + generateUID() + ']'
		dispatch(setMkTag(tag))
		const ts = state.app.createdTs
		const eVal = encrypt(tag.concat(ts), hsVal)
		dispatch(setEMKV(eVal))
	}

export const login =
	(val: string): OPMTypes.AppThunk<Promise<boolean>> =>
	async (dispatch, getState) => {
		const state = getState()
		const hsVal = cryptoHS(val)
		const dVal = decrypt(state.app.eMKV, hsVal)
		let success = false

		if (dVal.slice(0, 38) === state.app.mkTag) {
			const arg = dVal.slice(38)
			if (parseInt(arg) === state.app.createdTs) {
				dispatch(setMK(hsVal))

				const ts = await Device.getUptimeAsync()
				dispatch(setLts(ts))
				success = true
			}
		}
		return success
	}

export const sessionTimeLeft = (): OPMTypes.AppThunk<Promise<number>> => async (dispatch, getState) => {
	const state = getState()
	let tsSession = 0
	console.log('sessionTimeLeft - 1')
	if (state.secure.mk !== null && state.secure.lts !== 0 && state.app.mkTag !== null && state.app.eMKV !== null) {
		const ts = await Device.getUptimeAsync()

		// TODO: Testing for 1min, to change to something longer
		const period = 900000 //15min

		const elapsed = ts - state.secure.lts
		console.log('Elapsed time (state.secure.lts - ts)', elapsed)
		if (elapsed >= 0 && elapsed < period) {
			tsSession = period - elapsed
		}
	}
	return tsSession
}

export const invalidateSession = (): OPMTypes.AppThunk => dispatch => {
	console.log('invalidateSession - xxxxxxxxxxxxxxx')
	dispatch(setMK(null))
	dispatch(resetLts())
}

export const checkIsSessionValid = (state: RootState) => state.secure.mk !== null && state.secure.lts !== 0

export const getMK = (state: RootState) => state.secure.mk

export const { setMK, setLts, resetLts } = secureSlice.actions
export default secureSlice
