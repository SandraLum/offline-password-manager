import 'react-native-get-random-values'
import { encrypt, decrypt } from '@src/common/utils'
import { createTransform } from 'redux-persist'

const encryptTransform = ({ secretKey }: { secretKey: string }) =>
	createTransform(
		// transform state on its way to being serialized and persisted.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		(inboundState, _key) => {
			let transformedState = inboundState
			try {
				transformedState = encrypt(transformedState, secretKey)
			} catch (e) {
				console.error('Store transform encrypt error[encrypt]:', e)
				return inboundState
			}
			return transformedState
		},
		// transform state being rehydrated
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		(outboundState, _key) => {
			let transformedState = outboundState
			try {
				if (typeof transformedState === 'string') {
					transformedState = decrypt(transformedState, secretKey)
					if (typeof transformedState === 'string') {
						transformedState = JSON.parse(transformedState)
					}
				}
			} catch (e) {
				console.error('Store transform encrypt error[decrypt]:', e)
			}
			return transformedState
		}
	)

export { encryptTransform }
