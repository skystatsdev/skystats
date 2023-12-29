/* eslint-disable @typescript-eslint/naming-convention */
// Create/get a mongo connection to the backend
import { MongoClient } from 'mongodb';
import { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } from '$env/static/private';

const MONGO_CLIENT = new MongoClient(`mongodb://${MONGO_HOST}:${MONGO_PORT}`, {
	retryWrites: true,
	retryReads: true
});

await MONGO_CLIENT.connect();

export const mongo = MONGO_CLIENT.db(MONGO_DATABASE);
