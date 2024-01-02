import { Collections, MONGO } from '$mongo/mongo';
import type { ProfileDetails, StoredProfile, StoredProfileMember } from '$mongo/collections';

export async function updateStoredProfile(profile: StoredProfile) {
	const profileId = profile.id.replace(/-/g, '');

	await MONGO.collection(Collections.Profiles).updateOne(
		{ id: profileId },
		{ $set: { ...profile, id: profileId } },
		{ upsert: true }
	);
}

export async function updateStoredProfileMember(
	playerId: string,
	profileId: string,
	member: Partial<StoredProfileMember>
) {
	playerId = playerId.replace(/-/g, '');
	profileId = profileId.replace(/-/g, '');

	await MONGO.collection(Collections.ProfileMembers).updateOne(
		{ 'id.player': playerId, 'id.profile': profileId },
		{
			$set: member
		},
		{ upsert: true }
	);
}

export async function getStoredProfile(profileId: string) {
	profileId = profileId.replace(/-/g, '');

	return await MONGO.collection(Collections.Profiles).findOne<StoredProfile>(
		{
			id: profileId
		},
		{ projection: { _id: false } }
	);
}

export async function getStoredProfiles(playerId: string): Promise<ProfileDetails[]> {
	playerId = playerId.replace(/-/g, '');

	const details = await MONGO.collection(Collections.ProfileMembers)
		.aggregate<ProfileDetails>([
			{
				$match: {
					'id.player': playerId
				}
			},
			{
				$lookup: {
					from: Collections.Profiles,
					localField: 'id.profile',
					foreignField: 'id',
					as: 'profile'
				}
			},
			{
				$unwind: '$profile'
			},
			{
				$project: {
					_id: 0,
					id: '$id.profile',
					cuteName: '$cuteName',
					gameMode: '$profile.gameMode',
					selected: '$selected',
					removed: '$removed',
					members: '$profile.members',
					lastUpdated: '$profile.lastUpdated'
				}
			}
		])
		.toArray();

	return details;
}

export async function getStoredProfileMembers(profileId: string) {
	profileId = profileId.replace(/-/g, '');

	return await MONGO.collection(Collections.ProfileMembers)
		.find<StoredProfileMember>(
			{
				'id.profile': profileId
			},
			{ projection: { _id: false } }
		)
		.toArray();
}

export async function getStoredProfileMember(playerId: string, profileId: string) {
	playerId = playerId.replace(/-/g, '');
	profileId = profileId.replace(/-/g, '');

	return await MONGO.collection(Collections.ProfileMembers).findOne<StoredProfileMember>(
		{
			'id.player': playerId,
			'id.profile': profileId
		},
		{ projection: { _id: false } }
	);
}

export async function profileMemberExists(playerId: string, profileId: string) {
	playerId = playerId.replace(/-/g, '');
	profileId = profileId.replace(/-/g, '');

	return (
		(await MONGO.collection(Collections.ProfileMembers).countDocuments(
			{
				'id.player': playerId,
				'id.profile': profileId
			},
			{ limit: 1 }
		)) > 0
	);
}
