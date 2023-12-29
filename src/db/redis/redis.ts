// Create/get a redis connection to the backend
import { createClient } from 'redis';
import { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } from '$env/static/private';
import { building } from '$app/environment';

export const REDIS = createClient({
	url: `redis://default:${REDIS_PASSWORD}@${REDIS_HOST ?? 'localhost'}:${REDIS_PORT ?? 6379}`
});

REDIS.on('error', console.error);
REDIS.on('ready', () => console.log('Redis connection established'));

await REDIS.connect();

if (!building) {
	await REDIS.connect();
}
