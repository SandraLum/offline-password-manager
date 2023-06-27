import * as ExpoSecureStore from 'expo-secure-store'
export * from 'expo-secure-store'
import { generateUID, convertChar } from '@utils'

export interface SecureStorage {
	getItem: (key: string, ...args: Array<any>) => Promise<string | null>
	setItem: (key: string, value: any, ...args: Array<any>) => Promise<void>
	removeItem: (key: string, ...args: Array<any>) => Promise<string | null>
	init: () => Promise<void>
	getMK: () => Promise<string | null>
	k: string
}

export function createSecureStore(options: ExpoSecureStore.SecureStoreOptions | undefined): SecureStorage {
	const k = [95, 95, 98, 104, 69, 115, 53, 56, 101, 101, 56, 102, 48, 79, 95, 95].map(x => convertChar(x)).join('')

	function getItem(key: string, ...args: Array<any>) {
		return ExpoSecureStore.getItemAsync(key, options)
	}
	function setItem(key: string, value: any, ...args: Array<any>) {
		return ExpoSecureStore.setItemAsync(key, value, options)
	}
	function removeItem(key: string, ...args: Array<any>): any {
		return ExpoSecureStore.deleteItemAsync(key, options)
	}

	async function init() {
		const _t = await getItem(k)
		if (_t?.slice(0, 16) !== k) {
			await setItem(k, k.concat(generateUID()))
		}
	}

	async function getMK() {
		return await getItem(k)
	}

	return {
		getItem,
		setItem,
		removeItem,
		init,
		getMK,
		k
	}
}
