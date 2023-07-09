use crate::models::{hypixel::player::PlayerData, player::Rank};

pub fn rank(player: &PlayerData) -> Rank {
    if let Some(prefix) = &player.prefix {
        // prefix overrides all

        let formatted = prefix.to_owned();
        let mut name = String::new();
        let mut color = None;
        let mut plus_color = None;

        let mut next_is_formatting_code = false;
        let mut last_color = "#ffffff";
        for c in prefix.chars() {
            if c == '§' {
                next_is_formatting_code = true;
                continue;
            }
            if next_is_formatting_code {
                next_is_formatting_code = false;
                last_color = color_code_to_hex(c);
                if color.is_none() {
                    color = Some(color_code_to_hex(c));
                }
                continue;
            }
            if c == '+' {
                plus_color = Some(last_color);
            }
            name.push(c);
        }

        return Rank {
            name,
            color: color.unwrap_or("#ffffff").to_owned(),
            plus_color: plus_color.map(|s| s.to_owned()),
            formatted,
        };
    }

    let name = if player.monthly_package_rank.is_some()
        && player.monthly_package_rank != Some("NONE".to_owned())
    {
        player.monthly_package_rank.as_ref().unwrap().to_owned()
    } else if player.rank.is_some() && player.rank != Some("NORMAL".to_owned()) {
        player.rank.as_ref().unwrap().to_owned()
    } else {
        player
            .new_package_rank
            .to_owned()
            .or(player.package_rank.to_owned())
            .unwrap_or("NONE".to_owned())
            .replace("_PLUS", "+")
    };

    let mut bracket_color = None;

    let name = match name.as_str() {
        "SUPERSTAR" => "MVP++",
        "YOUTUBER" => {
            bracket_color = Some('c');
            "YOUTUBE"
        }
        "GAME_MASTER" => "GM",
        "MODERATOR" => "MOD",
        _ => &name,
    };

    let mut plus_color_code = player.rank_plus_color.as_deref().map(color_name_to_code);

    let color_code = get_rank_color(name);
    let color = color_code_to_hex(color_code);
    let mut rank_color_prefix = format!("§{color_code}");

    if name == "YOUTUBE" {
        // the text is white, but only in the prefix
        rank_color_prefix = "§f".to_owned();
    }

    let plus_index = name.find('+').unwrap_or(name.len());
    let (name_without_plusses, plusses) = name.split_at(plus_index);

    if plusses.is_empty() {
        // can't have a plus color if there are no plusses lol
        plus_color_code = None;
    }

    let formatted = if let Some(plus_color_code) = plus_color_code {
        if let Some(bracket_color) = bracket_color {
            format!("§{bracket_color}[{rank_color_prefix}{name_without_plusses}§{plus_color_code}{plusses}{rank_color_prefix}§{bracket_color}]")
        } else {
            format!("${rank_color_prefix}[{name_without_plusses}§{plus_color_code}{plusses}{rank_color_prefix}]")
        }
    } else if name == "NONE" {
        rank_color_prefix
    } else if let Some(bracket_color) = bracket_color {
        format!("§{bracket_color}[{rank_color_prefix}{name}§{bracket_color}]")
    } else {
        format!("{rank_color_prefix}[{name}]")
    };

    Rank {
        name: name.to_owned(),
        color: color.to_owned(),
        plus_color: plus_color_code.map(|s| color_code_to_hex(s).to_owned()),
        formatted,
    }
}

fn color_code_to_hex(color_code: char) -> &'static str {
    match color_code {
        '0' => "#000000",
        '1' => "#0000be",
        '2' => "#00be00",
        '3' => "#00bebe",
        '4' => "#be0000", // red
        '5' => "#be00be",
        '6' => "#ffaa00", // gold
        '7' => "#bebebe",
        '8' => "#3f3f3f",
        '9' => "#3f3ffe",
        'a' => "#3ffe3f",
        'b' => "#3ffefe",
        'c' => "#fe3f3f", // light red
        'd' => "#fe3ffe",
        'e' => "#fefe3f",
        'f' => "#ffffff",
        _ => "#ffffff",
    }
}

fn color_name_to_code(color_name: &str) -> char {
    match color_name {
        "black" => '0',
        "dark_blue" => '1',
        "dark_green" => '2',
        "dark_aqua" => '3',
        "dark_red" => '4',
        "dark_purple" => '5',
        "gold" => '6',
        "gray" => '7',
        "dark_gray" => '8',
        "blue" => '9',
        "green" => 'a',
        "aqua" => 'b',
        "red" => 'c',
        "light_purple" => 'd',
        "yellow" => 'e',
        "white" => 'f',
        _ => 'f',
    }
}

fn get_rank_color(rank_name: &str) -> char {
    match rank_name {
        "NONE" => '7',
        "VIP" | "VIP+" => 'a',
        "MVP" | "MVP+" => 'b',
        "MVP++" => '6',
        "YOUTUBE" => 'c',
        "HELPER" => '9',
        "MOD" | "GM" => '2',
        "ADMIN" => 'c',
        _ => '7',
    }
}
