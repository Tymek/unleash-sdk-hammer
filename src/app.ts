import { startUnleash } from 'unleash-client'
import { sample } from './utils'

const [, , appName, Authorization] = Bun.argv
console.log('Starting: ', appName)
const rate = Number.parseInt(process.env.UNLEASH_HAMMER_RATE || '10')
const interval = 1_000 / rate

const flagDefinitions = await (
	await fetch(`${process.env.UNLEASH_URL}/api/client/features`, {
		headers: { Authorization },
	})
).json()

const flags = flagDefinitions.features?.map(({ name }: { name: string }) => name) as string[]

const unleash = await startUnleash({
	url: `${process.env.UNLEASH_URL}/api`,
	appName,
	customHeaders: { Authorization },
})

const events = [
	'ready',
	'synchronized',
	'registered',
	'sent',
	// 'count',
	'warn',
	'error',
	'unchanged',
	'changed',
	// 'impression',
]

for (const event of events) {
	unleash.on(event, () => console.log(appName, event))
}

setInterval(() => {
	const flag = sample(flags)
	unleash.isEnabled(flag)
}, interval)
