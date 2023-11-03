import axios from 'axios';
import { Request, Response } from 'express';
import { getGameByAppId } from '../../database/dbQueries';
import * as Types from '../../types';
import { GameController } from '../steam/game';

/**
 * Fetches and returns player statistics from the Steam API.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
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

//

/**
 * Fetches and returns the games owned by a specific Steam user.
 *
 * This function fetches the list of games owned by the user from the Steam API,
 * then for each game, it fetches additional data such as the release date.
 * The results are cached for 30 minutes to reduce the number of API calls.
 *
 * Note: This function could be improved by storing the user's games in a database,
 * which would eliminate the need to fetch and calculate the data each time.
 * - See TODO: StoringData
 *
 * @param {number} steamId - The Steam ID of the user.
 * @returns {Promise<Types.UserGameData[]>} - A promise that resolves to an array of games owned by the user.
 *
 */

export const getOwnedGames = async (steamId: number) => {
  const apiKey = process.env.STEAM_API_KEY;

  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&format=json`;

  try {
    const response = await axios.get<Types.SteamOwnedGamesData>(url);
    // TODO: StoringData
    if (response.data.response.game_count === 0) {
      console.error('No games found for that user');
      return [];
    }
    const games = response.data.response;

    const gameList = [];
    for (const game of games.games) {
      const currentGame: Types.UserGameData = game;
      // This is getting additional data on games like release date
      const gameData: Types.GameData[] = await getGameByAppId(game.appid);

      if (!gameData || gameData.length === 0) {
        try {
          const appData = await GameController.getGame(game.appid);
          if ('error' in appData) {
            // We just want to skip any apps that have no data for now
          } else if ('release_date' in appData) {
            currentGame.release_date = appData.release_date.date || '';
          }
        } catch (error) {
          console.error('No data could be retrieved for that game');
        }
      } else {
        currentGame.release_date = gameData[0].release_date;
      }
      gameList.push(currentGame);
    }

    return gameList;
  } catch (error) {
    console.error(error);
    return [];
  }
};
