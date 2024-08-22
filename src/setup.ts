import { createFlag, createProject, createToken } from './sdk'

const UNLEASH_URL = process.env.UNLEASH_URL || 'http://localhost:4242'
const UNLEASH_TOKEN = process.env.UNLEASH_URL // Prefer use of PAT (personal access tokens)
const environments = (process.env.UNLEASH_HAMMER_ENVIRONMENTS || 'development,production').split(
	',',
)

if (!UNLEASH_TOKEN) {
	throw new Error(`Token needed. Get one from ${UNLEASH_URL}/profile/personal-api-tokens`)
}

const stuffToSpawn = {
	projects: Number.parseInt(process.env.UNLEASH_HAMMER_PROJECTS || '3', 10),
	apps: Number.parseInt(process.env.UNLEASH_HAMMER_APPS || '12', 10),
	flags: Number.parseInt(process.env.UNLEASH_HAMMER_FLAGS || '25', 10),
}

const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const configPath = './config.json'
const file = Bun.file(configPath)
if (await file.exists()) {
	throw new Error('./config.json is already present. exiting')
}
const config = {
	projects: [] as string[],
	tokens: [] as string[],
	flags: [] as Array<[string, string]>,
	bootstrapped: true,
}

for (let i = 0; i < stuffToSpawn.projects; i++) {
	const { id } = await createProject(`hammer-${i + 1}`)
	console.log('Created project', { id })
	config.projects.push(id)
}

for (let i = 0; i < stuffToSpawn.apps; i++) {
	const id = await createToken(sample(environments), config.projects)
	console.log('Created token:', id)
	config.tokens.push(id)
}

for (let i = 0; i < stuffToSpawn.flags; i++) {
	const flag = await createFlag(sample(config.projects))
	console.log('Created flag:', flag)
	config.flags.push(flag)
}

await Bun.write(configPath, JSON.stringify(config, null, 2))
