/* eslint-disable indent */
import { createSlice } from '@reduxjs/toolkit'
import { cryptoHS, decode, generateSalt } from '@src/common/utils'

import { RootState } from '..'
import { getItem, setItem } from '../secureStore'

type Security = {
	secureTag: string | null
	securePassphrase: string | null
}

const initialState: Security = {
	secureTag: null,
	securePassphrase: null
}

const securitySlice = createSlice({
	name: 'secure',
	initialState,
	reducers: {
		setSecurePassphrase: (state, action) => {
			state.securePassphrase = action.payload
		},
		setSecureTag: (state, action) => {
			state.secureTag = action.payload
		}
	}
})

const saltKey = decode([115, 101, 99, 114, 101, 116, 107, 101, 121])

export const redirectScreen = (state: RootState) => {
	let screen: string
	if (state.secure.secureTag && state.secure.securePassphrase) {
		screen = 'Login'
	} else {
		screen = 'SetMasterPassword'
	}
	return screen
}

export const encryptPassword = async (pwd: string, resetSalt = false) => {
	let encrypted

	//Store the salt into the secure store, create a PDF out of it
	if (resetSalt) {
		await setSalt()
	}
	const salt = await getSalt()
	if (salt) {
		encrypted = cryptoHS(pwd, salt)
	} else {
		throw 'Error: Invalid sk'
	}
	return encrypted
}

export const clearSecureData = async () => {
	await setItem(saltKey, null)
}

const setSalt = async () => {
	await setItem(saltKey, generateSalt())
}

export const getSalt = async () => {
	return await getItem(saltKey)
}

export const { setSecurePassphrase, setSecureTag } = securitySlice.actions
export default securitySlice
