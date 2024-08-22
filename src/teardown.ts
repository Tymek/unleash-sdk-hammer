import { unlink } from 'node:fs/promises'
import { deleteFlag, deleteProject, deleteToken } from './sdk'
import { base_url } from './utils'

const UNLEASH_URL = process.env.UNLEASH_URL || 'http://localhost:4242'
const UNLEASH_TOKEN = process.env.UNLEASH_URL

if (!UNLEASH_TOKEN) {
	throw `Token needed. Get one from ${base_url}/profile/personal-api-tokens`
}

const configPath = './config.json'
const file = Bun.file(configPath)
if (!(await file.exists())) {
	throw new Error(`Configuration file ${configPath} does not exist.`)
}
const config = await file.json()

if (!config.bootstrapped) {
	throw new Error('Not tearing down setup that was not bootstrapped by hammer tool.')
}

if (config.tokens && config.tokens.length > 0) {
	config.tokens = await Promise.all(
		config.tokens.map(async (projectId: string) => {
			const success = await deleteToken(projectId)
			if (success) {
				console.log('Deleted token: ', projectId)
				return null
			}
			return projectId
		}),
	).then(tokens => tokens.filter(Boolean))
}

if (config.flags && config.flags.length > 0) {
	config.flags = await Promise.all(
		config.flags.map(async ([project, id]: [string, string]) => {
			const success = await deleteFlag(project, id)
			if (success) {
				console.log('Deleted flag: ', id)
				return null
			}
			return [project, id]
		}),
	).then(flags => flags.filter(Boolean))
}

if (config.projects && config.projects.length > 0) {
	config.projects = await Promise.all(
		config.projects.map(async (projectId: string) => {
			const success = await deleteProject(projectId)
			if (success) {
				console.log('Deleted project: ', projectId)
				return null
			}
			return projectId
		}),
	).then(projects => projects.filter(Boolean))
}

if (config.flags.length === 0 && config.projects.length === 0 && config.tokens.length === 0) {
	await unlink(configPath)
} else {
	await Bun.write(configPath, JSON.stringify(config, null, 2))
}
