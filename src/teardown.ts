import { deleteProject, deleteToken } from './sdk'

const UNLEASH_URL = process.env.UNLEASH_URL || 'http://localhost:4242'
const UNLEASH_TOKEN = process.env.UNLEASH_URL // Ensure use of the same token from the setup

if (!UNLEASH_TOKEN) {
	throw `Token needed. Get one from ${UNLEASH_URL}/profile/personal-api-tokens`
}

const configPath = './config.json'
const file = Bun.file(configPath)
if (!(await file.exists())) {
	throw new Error(`Configuration file ${configPath} does not exist.`)
}
const config = await file.json()

if (config.projects && config.projects.length > 0) {
	for (const projectId of config.projects) {
		await deleteProject(projectId)
		console.log('Deleted project: ', projectId)
	}
}

if (config.tokens && config.tokens.length > 0) {
	for (const projectId of config.tokens) {
		await deleteToken(projectId)
		console.log('Deleted token: ', projectId)
	}
}

await Bun.write(configPath, '{}')
