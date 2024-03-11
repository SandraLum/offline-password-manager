import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import * as utils from '@utils'
import tw from '@src/libs/tailwind'
import { OPMTypes } from '@src/common/types'
import { RootState } from '@src/store'

export const emptyProfile: OPMTypes.EmptyProfile = {
	name: '',
	description: '',
	avatar: {
		name: 'account',
		color: tw.color('zinc-700'),
		style: { backgroundColor: tw.color('zinc-200') }
	}
}

export const defaultProfiles: OPMTypes.Profile[] = [
	{
		id: utils.generateUID(),
		name: 'Me',
		description: 'Personal',
		avatar: {
			name: 'account',
			color: tw.color('orange-100'),
			style: { backgroundColor: tw.color('orange-500') }
		}
	},
	{
		id: utils.generateUID(),
		name: 'Family member 1',
		description: 'Family member',
		avatar: {
			name: 'account',
			color: tw.color('violet-200'),
			style: { backgroundColor: tw.color('purple-600') }
		}
	}
]

const profilesAdapter = createEntityAdapter<OPMTypes.Profile>({
	selectId: profile => profile.id
})

const initialState = profilesAdapter.upsertMany(profilesAdapter.getInitialState(), defaultProfiles)

const profilesSlice = createSlice({
	name: 'profiles',
	initialState,
	reducers: {
		profilesAddOne: profilesAdapter.addOne,
		profilesAddMany: profilesAdapter.addMany,
		profileUpdate: profilesAdapter.updateOne,
		profileRemove: profilesAdapter.removeOne,
		profileRemoveAll: profilesAdapter.removeAll
	}
})

export const resetProfiles: OPMTypes.AppThunk = (dispatch, getState) => {
	const state = getState()

	profilesAdapter.removeAll(state)
	profilesAdapter.upsertMany(profilesAdapter.getInitialState(), defaultProfiles)
}

export const clearProfiles: OPMTypes.AppThunk = (dispatch, getState) => {
	dispatch(profileRemoveAll())
}

export const { selectAll: selectAllProfiles, selectById: selectProfileById } = profilesAdapter.getSelectors(
	(state: RootState) => state.main.profiles
)
export const { profilesAddOne, profilesAddMany, profileUpdate, profileRemove, profileRemoveAll } = profilesSlice.actions
export default profilesSlice
