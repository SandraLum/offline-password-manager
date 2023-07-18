import 'react-native-get-random-values'
import { encrypt, decrypt } from '@src/common/utils'
import { createTransform } from 'redux-persist'

const encryptTransform = async (sk: string | null, isSecureStore = false) => {
	// const sk = await ss.getSSK()

	return createTransform(
		// transform state on its way to being serialized and persisted.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		(inboundState, _key) => {
			let transformedState
			try {
				if (isSecureStore) {
					console.log('inboundState - key', _key)
				}
				if (typeof sk === 'string') {
					transformedState = encrypt(inboundState, sk)
				}
			} catch (e) {
				console.error('Store transform encrypt error[encrypt]:', e)
			}
			return transformedState || inboundState
		},
		// transform state being rehydrated
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		(outboundState, _key) => {
			let transformedState
			try {
				console.log('outboundState - isSecureStore', isSecureStore)
				if (isSecureStore) {
					console.log('outboundState - key', _key)
				}

				if (typeof outboundState === 'string') {
					if (typeof sk === 'string') {
						transformedState = decrypt(outboundState, sk)
						if (typeof transformedState === 'string' && !isSecureStore) {
							console.log('outboundState - key', _key)
							console.log('outboundState - transformedState', transformedState)
							transformedState = JSON.parse(transformedState)
						}
					}
				}
			} catch (e) {
				console.error('Store transform encrypt error[decrypt]:', e)
			}
			return transformedState || outboundState
		}
	)
}

export { encryptTransform }
