// Create/get a mongo connection to the backend
import { MongoClient } from 'mongodb';
import { MONGO_HOST, MONGO_PORT, MONGO_DATABASE } from '$env/static/private';
import { building } from '$app/environment';
import fs from 'fs';
import path from 'path';

export enum Collections {
	Players = 'players',
	Profiles = 'profiles',
	ProfileMembers = 'profileMembers'
}

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

	const mongo = mongoClient.db(MONGO_DATABASE);

	mongo.collection(Collections.ProfileMembers).createIndex(
		{
			'id.player': 1,
			'id.profile': 1
		},
		{
			unique: true
		}
	);

	mongo.collection(Collections.Players).createIndex(
		{
			id: 1
		},
		{
			unique: true
		}
	);

	mongo.collection(Collections.Profiles).createIndex(
		{
			id: 1
		},
		{
			unique: true
		}
	);
}

export const MONGO = mongoClient.db(MONGO_DATABASE);

const scripts = fs.readdirSync(path.resolve('src/db/mongo/scripts'));
for (const script of scripts) {
	import(/* @vite-ignore */ `./scripts/${script}`);
}
