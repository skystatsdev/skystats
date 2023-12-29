import { mongo } from './mongo';

await Promise.all([
	mongo.collection('profiles').createIndex({ uuid: 1 }),
	mongo.collection('player').createIndex({ uuid: 1 })
]);
