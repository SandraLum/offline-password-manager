import { createEntityAdapter, createSlice } from '@reduxjs/toolkit'

type Favourite = {
	id: string
	type: 'ENTRY' | 'GROUP'
	lastUpdatedOn: number | string
}

const defaultfavourties: Favourite[] = []
const favourtiesAdapter = createEntityAdapter<Favourite>({
	selectId: favourite => favourite.id || '',
	sortComparer: (a, b) => new Date(b.lastUpdatedOn).valueOf() - new Date(a.lastUpdatedOn).valueOf()
})

const initialState = favourtiesAdapter.upsertMany(favourtiesAdapter.getInitialState(), defaultfavourties)

const favourtiesSlice = createSlice({
	name: 'favourites',
	initialState,
	reducers: {
		favourtiesAddOne: favourtiesAdapter.addOne,
		favourtiesAddMany: favourtiesAdapter.addMany,
		favourtiesSetAll: favourtiesAdapter.setAll,
		favouriteUpdate: favourtiesAdapter.updateOne,
		favouriteRemove: favourtiesAdapter.removeOne,
		favouriteRemoveAll: favourtiesAdapter.removeAll
	}
})

export const {
	favourtiesAddOne,
	favourtiesAddMany,
	favourtiesSetAll,
	favouriteUpdate,
	favouriteRemove,
	favouriteRemoveAll
} = favourtiesSlice.actions
export default favourtiesSlice
