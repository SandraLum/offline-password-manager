import { encrypt, decrypt, cryptoHS } from '@utils'

describe('Encryption and decryption', () => {
	const value = 'Some values'
	const secret = 'testing'

	beforeEach(() => {})

	test('Encrypt and decrypt should return back the original value', () => {
		const encrypted = encrypt(value, secret)
		const decrypted = decrypt(encrypted, secret)
		expect(decrypted).toBe(value)
	})

	test('Encrypting with the same value produce a different encrypted value', () => {
		const encrypted = encrypt(value, secret)
		const encrypted1 = encrypt(value, secret)
		expect(encrypted).not.toBe(encrypted1)
	})

	test('Decrypting with the same secret should produce a same original value, ', () => {
		const encrypted = encrypt(value, secret)
		const encrypted1 = encrypt(value, secret)

		const decrypted = decrypt(encrypted, secret)
		const dncrypted1 = decrypt(encrypted1, secret)
		expect(decrypted).toBe(dncrypted1)
	})

	test('Encrypt should accept JSON value but decrypting will return a stringified JSON', () => {
		const value = { a: '123' }
		const encrypted = encrypt(value, secret)
		const decrypted = decrypt(encrypted, secret)
		expect(decrypted).toBe(JSON.stringify(value))
	})

	test('Encrypt should throw an error without secret is not provided', () => {
		expect(() => {
			encrypt(value)
		}).toThrow(TypeError)
	})

	test('CryptoHS should hash consistently with the same value and salt passed', () => {
		const hashed1 = cryptoHS(value, secret)
		const hashed2 = cryptoHS(value, secret)
		expect(hashed1).toBe(hashed2)
	})

	test('Decryption should return empty string if provided with incorrect secret', () => {
		const encrypted = encrypt(value, secret)
		const decrypted = decrypt(encrypted, secret + 'asd')
		expect(decrypted).toBe('')
	})
})
