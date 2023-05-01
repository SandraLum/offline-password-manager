import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	masterKey: ''
}

const secureSlice = createSlice({
	name: 'secure',
	initialState,
	reducers: {
		setMasterKey: (state, action) => {
			const payload = action.payload
			//TODO: Add encryption logic

			state.masterKey = payload
		}
	}
})

export const { setMasterKey } = secureSlice.actions
export default secureSlice

// // Can still subscribe to the store
// store.subscribe(() => console.log(store.getState()))

// // Still pass action objects to `dispatch`, but they're created for us
// store.dispatch(setMasterKey(password))
// // {value: 1}
