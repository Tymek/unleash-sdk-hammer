export const sample = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)]

export const base_url = (process.env.UNLEASH_URL || 'http://localhost:4242').replace(/\/$/, '')
