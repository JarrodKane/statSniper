import axios from 'axios';
import { insertGame } from '../../database/dbQueries';
import * as Types from '../../types';

type GameResult =
  | Types.SteamAppDetailsResponse['data']['data']
  | { error: string };

/**
 * GameController is an object that contains methods for fetching and manipulating game data.
 * Right now it only really grabs a game
 * @namespace GameController
 */
export const GameController = {
  /**
   * Fetches game data from the Steam API and inserts it into the database.
   * If the game data doesn't exist or an error occurs, it returns an object with an error property.
   *
   * Note: Some apps return a success status but have no data. These are ignored and not counted towards the gamer's score.
   * Example of such an app is appId: 2350. It might be a DLC or product, but not a game, or a game that's been removed.
   *
   * Note:  We also provide hard codded data in the insert game because we only have 1 provider right now, this should be changed to make it dynamic
   *
   * @param {number} appId - The ID of the game to fetch data for.
   * @returns {Promise<GameResult>} - A promise that resolves to the game data or an error object.
   * @memberof GameController
   */
  async getGame(appId: number): Promise<GameResult> {
    try {
      const response = await axios.get<Types.SteamAppDetailsResponse>(
        `https://store.steampowered.com/api/appdetails?appids=${appId}`
      );

      const gameData = response.data[appId].data;
      try {
        if (gameData?.name) {
          await insertGame({
            app_id: appId,
            provider_id: 1,
            name: gameData?.name,
            release_date: gameData?.release_date.date || '',
            image: gameData?.header_image || '',
          });
          return gameData;
        }
      } catch (error) {
        console.error(error);
        return { error: 'No Data' };
      }
      return { error: 'No Data' };
    } catch (error) {
      console.error(error);
      return { error: 'No Data' };
    }
  },
};
