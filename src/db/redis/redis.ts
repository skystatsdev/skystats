// Create/get a redis connection to the backend
import { createClient } from 'redis';
import { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } from '$env/static/private';
import { building } from '$app/environment';

export const redis = createClient({
	url: `redis://default:${REDIS_PASSWORD}@${REDIS_HOST ?? 'localhost'}:${REDIS_PORT ?? 6379}`
});

redis.on('error', console.error);
redis.on('ready', () => console.log('Redis connection established'));

// Don't connect to redis duing build step
if (!building) {
	await redis.connect();
}
