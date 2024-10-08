import { base_url, gaussianSample, id } from './utils'

const { UNLEASH_TOKEN } = process.env

const headers = {
	Authorization: UNLEASH_TOKEN || '',
	'Content-Type': 'application/json',
}

export const createProject = async (name: string) =>
	(
		await fetch(`${base_url}/api/admin/projects`, {
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
	(
		await fetch(`${base_url}/api/admin/projects/${name}`, {
			headers,
			method: 'DELETE',
		})
	).ok

export const createToken = async (
	environment: string,
	projects: string[] = ['*'],
	prefix = 'hammer',
) => {
	const username = `${prefix}_${id()}`
	const response = await fetch(`${base_url}/api/admin/api-tokens`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			username,
			type: 'CLIENT',
			environment,
			projects,
		}),
	})
	const json = await response.json()
	return [username, json.secret]
}

export const deleteToken = async (name: string) =>
	(
		await fetch(`${base_url}/api/admin/api-tokens/${name}`, {
			headers,
			method: 'DELETE',
		})
	).ok

export const getTokens = async () =>
	(
		await fetch(`${base_url}/api/admin/api-tokens`, {
			headers,
		})
	).json()

export const createFlag = async (
	project: string,
	environments: string[],
	prefix = 'hammer',
): Promise<[string, string]> => {
	const name = `${prefix}_${id()}`
	await fetch(`${base_url}/api/admin/projects/${project}/features`, {
		method: 'POST',
		headers,
		body: JSON.stringify({
			type: 'release',
			name,
			description: 'Generated by unleash-sdk-hammer',
			impressionData: true,
		}),
	})
	for (const environment of environments) {
		const rollout = `${Math.round(gaussianSample(Array.from({ length: 99 }, (_, i) => i + 1)))}`

		await fetch(
			`${base_url}/api/admin/projects/${project}/features/${name}/environments/${environment}/strategies`,
			{
				method: 'POST',
				headers,
				body: JSON.stringify({
					name: 'flexibleRollout',
					constraints: [],
					parameters: {
						rollout,
						stickiness: 'default',
						groupId: name,
					},
					variants: [],
					segments: [],
					disabled: false,
				}),
			},
		)

		await fetch(
			`${base_url}/api/admin/projects/${project}/features/${name}/environments/${environment}/on?shouldActivateDisabledStrategies=false`,
			{
				headers,
				method: 'POST',
			},
		)
	}

	return [project, name]
}

export const deleteFlag = async (project: string, id: string) =>
	(
		await fetch(`${base_url}/api/admin/projects/${project}/features/${id}`, {
			headers,
			method: 'DELETE',
		})
	).ok

export const getFlags = async () =>
	(
		await fetch(`${base_url}/api/admin/search/features`, {
			headers,
		})
	).json()
