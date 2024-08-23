import { customAlphabet } from 'nanoid'

export const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export const base_url = (process.env.UNLEASH_URL || 'http://localhost:4242').replace(/\/$/, '')

export const id = () => {
	const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	const nanoid = customAlphabet(alphabet, 10)
	return nanoid()
}
