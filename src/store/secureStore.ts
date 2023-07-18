import * as ExpoSecureStore from 'expo-secure-store'
export * from 'expo-secure-store'
import { generateUID, decode } from '@utils'

const DefaultSecureOptions = {
	keychainAccessible: ExpoSecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY
}
export interface SecureStorage {
	getItem: (key: string, ...args: Array<any>) => Promise<string | null>
	setItem: (key: string, value: any, ...args: Array<any>) => Promise<void>
	removeItem: (key: string, ...args: Array<any>) => Promise<string | null>
	init: () => Promise<void>
	getSSK: () => Promise<string | null>
	k: string
}

function encodeKey(key: string, char = '_') {
	return key.replace(/[^a-z0-9.\-_]/gi, char)
}

export function getItem(key: string, options = DefaultSecureOptions) {
	return ExpoSecureStore.getItemAsync(encodeKey(key), options)
}

export function setItem(key: string, value: any, options = DefaultSecureOptions) {
	console.log('key', key)
	return ExpoSecureStore.setItemAsync(encodeKey(key), value, options)
}

export function removeItem(key: string, options = DefaultSecureOptions): any {
	return ExpoSecureStore.deleteItemAsync(encodeKey(key), options)
}

export function createSecureStore(options = DefaultSecureOptions): SecureStorage {
	const k = decode([95, 95, 98, 104, 69, 115, 53, 56, 101, 101, 56, 102, 48, 79, 95, 95])

	// function getItem(key: string, ...args: Array<any>) {
	// 	return ExpoSecureStore.getItemAsync(encodeKey(key), options)
	// }

	// function setItem(key: string, value: any, ...args: Array<any>) {
	// 	console.log('key', key)
	// 	return ExpoSecureStore.setItemAsync(encodeKey(key), value, options)
	// }

	// function removeItem(key: string, ...args: Array<any>): any {
	// 	return ExpoSecureStore.deleteItemAsync(encodeKey(key), options)
	// }

	function _getItem(key: string) {
		return getItem(key, options)
	}

	function _setItem(key: string, value: any) {
		return setItem(key, value, options)
	}

	function _removeItem(key: string) {
		return removeItem(key, options)
	}

	async function init() {
		console.log('innit')
		const _t = await _getItem(k)
		if (_t?.slice(0, 16) !== k) {
			await _setItem(k, k.concat(generateUID()))
		}
		console.log('innit - end')
	}

	async function getSSK() {
		return await _getItem(k)
	}

	return {
		getItem: _getItem,
		setItem: _setItem,
		removeItem: _removeItem,
		init,
		getSSK,
		k
	}
}
