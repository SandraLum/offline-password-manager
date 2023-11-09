export const schemaMigrationVersion = 0

export const run = (restoreState: any) => {
	const migrationList = [{ version: -1, exec: (state: any) => sample_script(state) }]

	const { version } = restoreState['[OPM_BKUP]']

	if (schemaMigrationVersion === version) {
		console.log('No migration required.')
		return restoreState.data
	} else {
		const data = { ...restoreState.data }
		migrationList.forEach(m => {
			if (m.version > version) {
				m.exec(data)
			}
		})
		return data
	}

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

	function sample_script(data: any) {
		/*
			Migration of an older state schema to the current schema
			e.g Example of updating the profile avatar to image instead of color and icon

			for (const [key, value] of Object.entries(data.main.profiles?.entities)) {
				data.main.profiles.entities[key].avatar = { image: { id:'avataricon-1', path: require('../../../assets/images/avatars/avatar-orange-50.png')} }
			}
			return data
		*/

		// SL: TODO delete test example
		for (const profile of data.main.profiles) {
			profile.avatar_test = {
				image: { id: 'avataricon-1', path: require('../../../assets/images/icons/icons8-discord-new-50.png') }
			}
		}
		return data
	}
}

// export const migrations = (restoreState: any) => {
// 	const migrationList = [{ version: 0, exec: (state: any) => sample_script(state) }]

// 	if (schemaMigrationVersion === restoreState.version) {
// 		console.log('No migration required.')
// 		return restoreState.data
// 	} else {
// 		const data = { ...restoreState.data }
// 		migrationList.forEach(m => {
// 			if (m.version > restoreState.version) {
// 				m.exec(data)
// 			}
// 		})
// 		return data
// 	}

// 	// - decrypt the data
// 	// - Check the version of the data
// 	// - Check if migration scripts needs to be run
// 	// - Clear the existing data
// 	//		- profiles
// 	//		- entries
// 	//		- settings
// 	//		- categories
// 	//		- appSlice => currentProfile: { id?: OPMTypes.Profile['id'] }
// 	// - Insert profile first
// 	// - Insert entries

// 	function sample_script(data: any) {
// 		/*
// 			Migration of an older state schema to the current schema
// 			e.g Example of updating the profile avatar to image instead of color and icon

// 			for (const [key, value] of Object.entries(data.main.profiles?.entities)) {
// 				data.main.profiles.entities[key].avatar = { image: { id:'avataricon-1', path: require('../../../assets/images/avatars/avatar-orange-50.png')} }
// 			}
// 			return data
// 		*/

// 		// SL: TODO delete test example
// 		for (const [key, value] of Object.entries(data.main.profiles?.entities)) {
// 			data.main.profiles.entities[key].avatar_test = {
// 				image: { id: 'avataricon-1', path: require('../../../assets/images/icons/icons8-discord-new-50.png') }
// 			}
// 		}
// 		return data
// 	}
// }
