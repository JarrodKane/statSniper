import axios from 'axios';
import { Request, Response } from 'express';
import { checkIfGameExists } from '../../database/dbQueries';
import { GameController } from './game';

// This is calling the steam api for user info

export const getPlayerStats = async (req: Request, res: Response) => {
  const { steamId } = req.params;
  const apiKey = process.env.STEAM_API_KEY;
  const url = `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`;

  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve player stats' });
  }
};

export const getOwnedGames = async (steamId: string) => {
  const apiKey = process.env.STEAM_API_KEY;
  console.log('HEHEHEHEH');

  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&format=json`;

  try {
    const response = await axios.get(url);

    // If there are no games just return early
    if (response.data.response.game_count === 0) {
      return { error: 'No games found' };
    }

    for (const game of response.data.response.games) {
      const gameInDB = await checkIfGameExists(game.appid);
      if (!gameInDB) {
        console.log('NO GAMEW');
        const gameData = await GameController.getGame(game.appid);
      }
    }

    return response.data.response.games;
  } catch (error) {
    console.error(error);
    return { error: 'Failed to retrieve players games' };
  }
};
