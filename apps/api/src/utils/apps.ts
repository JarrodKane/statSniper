import axios from 'axios';
import db from '../database';

// Originally thought that we could get all of the apps on steam and then get the details for each one.
// It's doable but I felt it's a little out of scope for this test, so I'm just going to get the details for the games that the user owns.

// `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${apiKey}&include_games=true`
// 'https://api.steampowered.com/ISteamApps/GetAppList/v2/'

// const STEAM_APP_LIST_URL = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${apiKey}&include_games=true`;

interface SteamApp {
  appid: number;
  name: string;
}

interface SteamAppListResponse {
  applist: {
    apps: SteamApp[];
  };
}

interface SteamAppDetailsResponse {
  success: boolean;
  data: {
    type: string;
    name: string;
    steam_appid: number;
    required_age: number;
    is_free: boolean;
    detailed_description: string;
    about_the_game: string;
    short_description: string;
    supported_languages: string;
    header_image: string;
    website: string;
    pc_requirements: {
      minimum: string;
      recommended: string;
    };
    mac_requirements: {
      minimum: string;
      recommended: string;
    };
    linux_requirements: {
      minimum: string;
      recommended: string;
    };
    legal_notice: string;
    developers: string[];
    publishers: string[];
    price_overview: {
      currency: string;
      initial: number;
      final: number;
      discount_percent: number;
      initial_formatted: string;
      final_formatted: string;
    };
    packages: number[];
    package_groups: {
      name: string;
      title: string;
      description: string;
      selection_text: string;
      save_text: string;
      display_type: number;
      is_recurring_subscription: string;
      subs: {
        packageid: number;
        percent_savings_text: string;
        percent_savings: number;
        option_text: string;
        option_description: string;
        can_get_free_license: string;
        is_free_license: boolean;
        price_in_cents_with_discount: number;
      }[];
    }[];
    platforms: {
      windows: boolean;
      mac: boolean;
      linux: boolean;
    };
    metacritic: {
      score: number;
      url: string;
    };
    categories: {
      id: number;
      description: string;
    }[];
    genres: {
      id: string;
      description: string;
    }[];
    screenshots: {
      id: number;
      path_thumbnail: string;
      path_full: string;
    }[];
    movies: {
      id: number;
      name: string;
      thumbnail: string;
      webm: {
        '480': string;
        max: string;
      };
      mp4: {
        '480': string;
        max: string;
      };
      highlight: boolean;
    }[];
    recommendations: {
      total: number;
    };
    achievements: {
      total: number;
      highlighted: {
        name: string;
        path: string;
      }[];
    };
    release_date: {
      coming_soon: boolean;
      date: string;
    };
    support_info: {
      url: string;
      email: string;
    };
    background: string;
    content_descriptors: {
      ids: number[];
      notes: string;
    };
  };
}

async function fetchSteamAppList(): Promise<SteamApp[]> {
  const apiKey = process.env.STEAM_API_KEY;
  console.log(apiKey);
  const response = await axios.get(
    `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${apiKey}&include_games=true&include_dlc=true&max_results=50000`
  );
  return response.data.response.apps;
}

//`https://store.steampowered.com/api/appdetails?appids=${appId}`

async function fetchSteamAppDetails(
  appId: number
): Promise<SteamAppDetailsResponse> {
  const response = await axios.get<SteamAppDetailsResponse>(
    `https://store.steampowered.com/api/appdetails?appids=${appId}`
  );

  return response.data[appId];
}

async function insertSteamAppDetailsIntoDatabase(
  steamApp: SteamApp
): Promise<void> {
  const steamAppDetails = await fetchSteamAppDetails(steamApp.appid);
  if (steamAppDetails.data) {
    const { name, steam_appid, release_date, header_image } =
      steamAppDetails.data;

    await db.run(
      'INSERT INTO game (app_id, provider_id, name, release_date, image) VALUES (?, ?, ?, ?, ?)',
      steam_appid || null,
      '1',
      name || null,
      release_date || null,
      header_image || null
    );
  }
}

export async function fetchAndInsertSteamAppsIntoDatabase(): Promise<void> {
  const steamAppList = await fetchSteamAppList();
  const count = 0;
  console.log(
    'Steam app list length------------------------------------------'
  );
  console.log(steamAppList.length);
  console.log(
    'Steam app list length------------------------------------------'
  );

  for (const steamApp of steamAppList) {
    await checkIfGameExists(steamApp);
  }
}

const checkIfGameExists = async (steamApp: SteamApp) => {
  return new Promise((resolve, reject) => {
    const sql = `
    SELECT *
    FROM game
    WHERE game.app_id = ?
    `;

    db.all(sql, [steamApp.appid], async (err, rows) => {
      if (err) {
        console.log('Fetching game data');
        await insertSteamAppDetailsIntoDatabase(steamApp);
      } else {
        if (rows.length === 0) {
          console.log('Fetching game data');
          // Was trying to avoid rate limiting, but it did not work
          // await delay(1000);
          await insertSteamAppDetailsIntoDatabase(steamApp);
        }
        resolve(rows);
      }
    });
  });
};
