import axios from 'axios';
import { Request, Response } from 'express';
import * as SharedTypes from 'shared-types';
import { getGamesListByAppId } from '../../database/dbQueries';
import * as Types from '../../types';
import * as steam from '../steam';

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

/**
 * Fetches and returns the games owned by a specific Steam user.
 *
 * This function fetches the list of games owned by the user from the Steam API,
 * then for each game, it fetches additional data such as the release date.
 *
 * Note: This function could be improved by storing the user's games in a database,
 * which would eliminate the need to fetch and calculate the data each time.
 *
 * @param {number} steamId - The Steam ID of the user.
 * @returns {Promise<{steam: SharedTypes.UserGameStats}>} - A Promise that resolves to an object with a key of "steam" and a value of type `Types.UserGameStats`.
 *
 */
export const getOwnedGames = async (steamId: string) => {
  const apiKey = process.env.STEAM_API_KEY;

  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&format=json`;

  try {
    const response = await axios.get<SharedTypes.SteamOwnedGamesData>(url);
    if (
      response.data.response.game_count === 0 ||
      !response.data.response.games
    ) {
      console.error('No games found for that user');
      return [];
    }
    const usersOwnedGames = response.data.response;
    const gameList = [];
    let totalPlayTime = 0;

    const appIds = usersOwnedGames.games.map((game) => game.appid);
    const gameDataList: Types.GameData[] = await getGamesListByAppId(appIds);

    for (const game of usersOwnedGames.games) {
      const currentGame: SharedTypes.UserGameData = game;
      // This is getting additional data on games like release date
      const gameData = gameDataList.find((data) => data.app_id === game.appid);

      if (gameData) {
        currentGame.release_date = gameData?.release_date || '';
        currentGame.metacritic = gameData?.metacritic || 0;
        currentGame.price = gameData?.price || 0;
        currentGame.rtime_last_played = game?.rtime_last_played;
      }

      totalPlayTime += game?.playtime_forever || 0;
      gameList.push(currentGame);
    }
    const stats = {
      totalPlayTime,
      totalGames: usersOwnedGames.game_count,
      games: gameList,
    };
    return stats;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMissingOwnedGames = async (req: Request, res: Response) => {
  const { steamId } = req.params;
  const userIdPart = steamId.split('=')[1];
  const apiKey = process.env.STEAM_API_KEY;
  const steamController = steam.game.GameController();

  const url = `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${userIdPart}&include_appinfo=true&format=json`;

  try {
    const response = await axios.get<SharedTypes.SteamOwnedGamesData>(url);
    if (
      response.data.response.game_count === 0 ||
      !response.data.response.games
    ) {
      console.error('No games found for that user');
      return [];
    }

    const usersOwnedGames = response.data.response;
    const appIds = usersOwnedGames.games.map((game) => game.appid);
    const gameDataList: Types.GameData[] = await getGamesListByAppId(appIds);
    // filter out the games that have been returned from the db we don't care about them
    const missingAppIds = appIds.filter(
      (appId) => !gameDataList.find((data) => data.app_id === appId)
    );

    const missingGames = await steamController.getListOfGames(missingAppIds);
    res.json(missingGames);
  } catch (error) {
    res.json(error);
  }
};
