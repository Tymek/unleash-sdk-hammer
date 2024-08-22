import { spawn } from 'bun'
import { createProject } from './sdk'

const UNLEASH_URL = process.env.UNLEASH_URL || 'http://localhost:4242'
const UNLEASH_TOKEN = process.env.UNLEASH_URL // Prefer use of PAT (personal access tokens)

if (!UNLEASH_TOKEN) {
	throw `Token needed. Get one from ${UNLEASH_URL}/profile/personal-api-tokens`
}

const stuffToSpawn = {
	projects: 3,
	apps: 12,
	flags: 50,
}

const configPath = './config.json'
const file = Bun.file(configPath)
if (!(await file.exists())) {
	throw 'Run setup first'
}

// const buns = new Array(config.tokens.length)

// for (let i = 0; i < buns.length; i++) {
// 	buns[i] = spawn({
// 		cmd: ['bun', './app.ts'],
// 		stdout: 'inherit',
// 		stderr: 'inherit',
// 		stdin: 'inherit',
// 	})
// }

// function kill() {
// 	for (const bun of buns) {
// 		bun.kill()
// 	}
// }

// process.on('SIGINT', kill)
// process.on('exit', kill)
