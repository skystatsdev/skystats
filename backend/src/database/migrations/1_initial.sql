create table member_leaderboards (
    player_uuid UUID,
    profile_uuid UUID,
    primary key (player_uuid, profile_uuid),
    player_username text,
    player_rank_name text,
    player_rank_color text,
    player_rank_plus_color text,
    player_rank_formatted text,
    profile_name text
);