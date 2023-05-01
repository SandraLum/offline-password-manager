import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import * as utils from '@utils'
import tw from 'twrnc'
import { OPMTypes } from '@src/common/types'
import { RootState } from '@src/store'

export const emptyProfile: OPMTypes.EmptyProfile = {
	name: '',
	description: '',
	avatar: { icon: { name: '' } },
	categories: [],
	entries: []
}

export const defaultProfiles: OPMTypes.Profile[] = [
	{
		id: utils.generateUID(),
		name: 'Me',
		description: 'Personal',
		avatar: {
			icon: { name: 'account' },
			iconStyle: { backgroundColor: tw.color('bg-red-500') }
		}
	},
	{
		id: utils.generateUID(),
		name: 'Family member 1',
		description: 'Family member',
		avatar: {
			icon: { name: 'account' },
			iconStyle: { backgroundColor: tw.color('bg-purple-500') }
		}
	}
]

const profilesAdapter = createEntityAdapter<OPMTypes.Profile>({
	// Assume IDs are stored in a field other than `profile.id`
	selectId: (profile: OPMTypes.Profile) => profile.id
})

const initialState = profilesAdapter.upsertMany(profilesAdapter.getInitialState(), defaultProfiles)

const profilesSlice = createSlice({
	name: 'profiles',
	initialState,
	reducers: {
		profilesAddOne: profilesAdapter.addOne,
		profilesAddMany: profilesAdapter.addMany,
		profileUpdate: profilesAdapter.updateOne,
		profileRemove: profilesAdapter.removeOne
	}
})

export const { selectAll: selectAllProfiles, selectById: selectProfileById } = profilesAdapter.getSelectors(
	(state: RootState) => state.main.profiles
)
export const { profilesAddOne, profilesAddMany, profileUpdate, profileRemove } = profilesSlice.actions
export default profilesSlice
