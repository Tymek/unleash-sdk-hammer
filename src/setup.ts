import { createProject, createToken } from './sdk'

const UNLEASH_URL = process.env.UNLEASH_URL || 'http://localhost:4242'
const UNLEASH_TOKEN = process.env.UNLEASH_URL // Prefer use of PAT (personal access tokens)
const environments = (process.env.UNLEASH_HAMMER_ENVIRONMENTS || 'development,production').split(
	',',
)

if (!UNLEASH_TOKEN) {
	throw `Token needed. Get one from ${UNLEASH_URL}/profile/personal-api-tokens`
}

const stuffToSpawn = {
	projects: Number.parseInt(process.env.UNLEASH_HAMMER_PROJECTS || '3', 10),
	apps: Number.parseInt(process.env.UNLEASH_HAMMER_APPS || '12', 10),
	flags: Number.parseInt(process.env.UNLEASH_HAMMER_FLAGS || '100', 10),
}

const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]

const configPath = './config.json'
const file = Bun.file(configPath)
if (!(await file.exists())) {
	await Bun.write(configPath, '{}')
}
const config = await file.json()

if (!config.projects) {
	config.projects = []
	for (let i = 0; i < stuffToSpawn.projects; i++) {
		const { id } = await createProject(`hammer-${i + 1}`)
		console.log('Created project', { id })
		config.projects.push(id)
	}
}

if (!config.tokens) {
	config.tokens = []
	for (let i = 0; i < stuffToSpawn.apps; i++) {
		const id = await createToken(sample(environments), config.projects)
		console.log('Created token:', id)
		config.tokens.push(id)
	}
}

await Bun.write(configPath, JSON.stringify(config, null, 2))
