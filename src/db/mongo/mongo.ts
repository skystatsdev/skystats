// Create/get a mongo connection to the backend
import { MongoClient } from 'mongodb';
import { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } from '$env/static/private';
import { building } from '$app/environment';

const mongoClient = new MongoClient(
	`mongodb://${MONGO_HOST}:${MONGO_PORT}` /*{
	retryWrites: true,
	retryReads: true
}*/
);

// Don't connect to mongo duing build step
if (!building) {
	console.log('Connecting to MongoDB...');
	await mongoClient.connect();
}

export const MONGO = mongoClient.db(MONGO_DATABASE);
