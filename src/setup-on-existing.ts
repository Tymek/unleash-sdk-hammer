import { createProject, createToken, getFlags, getTokens } from './sdk'
import { base_url } from './utils'

const UNLEASH_TOKEN = process.env.UNLEASH_URL // Prefer use of PAT (personal access tokens)

if (!UNLEASH_TOKEN) {
	throw new Error(`Token needed. Get one from ${base_url}/profile/personal-api-tokens`)
}

const configPath = './config.json'
const file = Bun.file(configPath)
if (await file.exists()) {
	throw new Error('./config.json is already present. exiting')
}

const tokens = (await getTokens())?.tokens
	?.filter(({ type }: { type?: string }) => type === 'client')
	?.map(({ secret, username }: { secret?: string; username?: string }) => [username, secret])
	.slice(0, Number.parseInt(process.env.UNLEASH_HAMMER_APPS || '12', 10))

await Bun.write(configPath, JSON.stringify({ tokens }, null, 2))
