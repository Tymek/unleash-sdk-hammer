const { UNLEASH_URL, UNLEASH_TOKEN } = process.env

const headers = {
	Authorization: UNLEASH_TOKEN || '',
	'Content-Type': 'application/json',
}

export const createProject = async (name: string) =>
	(
		await fetch(`${UNLEASH_URL}/api/admin/projects`, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				name,
				description: 'Project to hammer',
				defaultStickiness: 'default',
				mode: 'open',
				changeRequestEnvironments: [],
			}),
		})
	).json() as Promise<{ id: string }>

export const deleteProject = async (name: string) =>
	await fetch(`${UNLEASH_URL}/api/admin/projects/${name}`, {
		headers,
		method: 'DELETE',
	})

export const createToken = async (
	environment: string,
	projects: string[] = ['*'],
	prefix = 'hammer',
) => {
	const username = `${prefix}_${crypto.randomUUID()}`
	await fetch(`${UNLEASH_URL}/api/admin/api-tokens`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			username,
			type: 'FRONTEND',
			environment,
			projects,
		}),
	})

	return username
}

export const deleteToken = async (name: string) =>
	fetch(`${UNLEASH_URL}/api/admin/api-tokens/${name}`, {
		headers,
		method: 'DELETE',
	})
