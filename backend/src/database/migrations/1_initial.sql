create table member_leaderboards (
    player_uuid UUID,
    profile_uuid UUID,
    primary key (player_uuid, profile_uuid)
);