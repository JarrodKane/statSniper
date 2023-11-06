export type SteamGameUserData = {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  has_community_visible_stats: boolean;
  playtime_windows_forever: number;
  playtime_mac_forever: number;
  playtime_linux_forever: number;
  rtime_last_played: number | undefined;
  has_leaderboards: boolean;
  playtime_disconnected: number;
};

export type SteamOwnedGamesData = {
  response: {
    game_count: number;
    games: SteamGameUserData[];
  };
};

export type UserGameData = SteamGameUserData & {
  release_date?: string;
  metacritic?: number;
  price?: number;
};

export type UserGameStats = {
  [key: string]: {
    totalPlayTime: number;
    games: UserGameData[];
  };
};
