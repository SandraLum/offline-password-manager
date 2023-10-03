/* eslint-disable indent */
import 'react-native-get-random-values'
import * as CryptoJS from 'crypto-js'
import { randomUUID } from 'expo-crypto'

export function generateUID(fnCheckForDuplicates?: (id: string) => boolean): string {
	const uid = randomUUID()
	if (fnCheckForDuplicates?.(uid)) {
		return generateUID(fnCheckForDuplicates)
	}
	return uid
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function clone(value: any) {
	console.log('clone typeof value', typeof value)
	if (Array.isArray(value) || typeof value === 'object') {
		try {
			console.log('parse')
			return JSON.parse(JSON.stringify(value))
		} catch {
			console.warn('Invalid JSON')
			return value
		}
	}
	return value
}

export function getInitials(name = ''): string {
	const initials: RegExpMatchArray | [] = name.replace(/[^a-zA-Z0-9- ]/g, '').match(/\b\w/g) ?? []
	initials.length = initials.length > 2 ? 2 : initials.length
	return initials.join('').toUpperCase()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getObjValue(obj: { [key: string | number]: any }, path: string): any {
	if (!path) return obj
	const properties: string[] = path.split('.')
	const key: string | null = properties.shift() || null
	return key ? getObjValue(obj[key], properties.join('.')) : obj
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(value: any): boolean {
	return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function stringify(
	obj: any,
	replacer?: EntryProcessor,
	indent?: string | number,
	decycler?: EntryProcessor
): string {
	return JSON.stringify(obj, serializer(replacer, decycler), indent)
}

type EntryProcessor = (key: string, value: any) => any
export function serializer(replacer?: EntryProcessor, decycler?: EntryProcessor): EntryProcessor {
	const stack: unknown[] = [],
		keys: string[] = []

	if (decycler == null)
		decycler = function (key, value) {
			if (stack[0] === value) return '[Circular ~]'
			return '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']'
		}

	return function (this: void, key, value) {
		if (stack.length > 0) {
			const thisPos = stack.indexOf(this)
			~thisPos ? stack.splice(thisPos + 1) : stack.push(this)
			~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key)
			if (~stack.indexOf(value)) value = decycler?.call(this, key, value)
		} else stack.push(value)

		return replacer == null ? value : replacer.call(this, key, value)
	}
}

// Encrypt/Decrypt
export function decrypt(value: string, secret: string): string {
	let decrypted = value
	try {
		if (typeof decrypted === 'string') {
			decrypted = CryptoJS.AES.decrypt(decrypted, secret).toString(CryptoJS.enc.Utf8)
		}
	} catch (e) {
		console.warn('[Error] Unable to decrypt', e)
	}
	return decrypted
}

export function encrypt(value: string | unknown, secret: string): string {
	let encrypted: string = typeof value !== 'string' ? JSON.stringify(value) : value
	try {
		encrypted = CryptoJS.AES.encrypt(encrypted, secret).toString()
	} catch (e) {
		console.warn('[Error] Unable to encrypt', e)
	}
	return encrypted
}

export function cryptoHS(value: string, salt: string): string {
	const key512Bits = CryptoJS.PBKDF2(value + salt, salt, {
		keySize: 512 / 32
	})
	return key512Bits.toString(CryptoJS.enc.Hex)
}

export function generateSalt() {
	return CryptoJS.lib.WordArray.random(128 / 8).toString()
}

export function isEmpty(str: string | undefined | null) {
	return str?.length === 0
}

export function union<T>(arr: T[], item: T): T[] {
	if (!arr.includes(item)) {
		return arr.concat(item)
	}
	return arr
}

export function convertChar(value: number) {
	return String.fromCharCode(value)
}

export function getRandom(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export function decode(arr: number[]) {
	return arr.map(x => convertChar(x)).join('')
}

export function intArrayShift(arr: Uint8Array, offset: number, reverse = false) {
	const result = new Uint8Array(arr.length)
	const len = arr.length - offset

	if (reverse) {
		result.set(arr.slice(len))
		result.set(arr.slice(0, len), offset)
	} else {
		result.set(arr.slice(offset))
		result.set(arr.slice(0, offset), len)
	}
	return result
}

export function formatDate(dt: Date, format?: string) {
	const yyyy = dt.getFullYear()
	let mm: string | number = dt.getMonth() + 1
	let dd: string | number = dt.getDate()

	if (dd < 10) dd = '0' + dd
	if (mm < 10) mm = '0' + mm

	const replaced = format
		? format
				.replace('dd', dd.toString())
				.replace('mm', mm.toString())
				.replace('yyyy', yyyy.toString())
				.replace('yy', yyyy.toString().substring(2))
		: dt.toLocaleString()

	return replaced
}

export const setIdFormat = (id: string) => `[${id}]`
