import { customAlphabet } from 'nanoid'

export const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export const base_url = (process.env.UNLEASH_URL || 'http://localhost:4242').replace(/\/$/, '')

export const id = () => {
	const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
	const nanoid = customAlphabet(alphabet, 10)
	return nanoid()
}

const gaussianRandom = (mean = 0, stdev = 1): number => {
	const u = 1 - Math.random()
	const v = Math.random()
	const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
	return z * stdev + mean
}

export const gaussianSample = <T>(arr: T[], stdev = 9): T => {
	const mean = (arr.length - 1) / 2
	const randomIndex = Math.round(gaussianRandom(mean, stdev))
	const clampedIndex = Math.max(0, Math.min(randomIndex, arr.length - 1))
	return arr[clampedIndex]
}
