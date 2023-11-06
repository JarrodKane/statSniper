import axios from 'axios';
import { insertGame } from '../../database/dbQueries';
import * as Types from '../../types';

type GameResult = {
  message?: string;
  error?: string;
};

type ErrorResponse = {
  response: {
    status: string;
    message: string;
  };
};

/**
 * GameController is a closure that encapsulates game-related operations.
 * It maintains a private `rateLimited` state to handle rate limiting.
 * @returns {Object} An object with methods to interact with games.
 */
export const GameController = () => {
  let rateLimited = false;

  /**
   * Fetches a list of games based on their appIds.
   * If rateLimited is true, it returns an error.
   * @param {number[]} appIds - An array of game appIds.
   * @returns {Promise<Object>} A promise that resolves to an object with a message or an error.
   */
  const getListOfGames = async (appIds: number[]) => {
    if (rateLimited) {
      return { error: 'Rate Limited' };
    }

    for (const appId of appIds) {
      try {
        // We need to wait 2 seconds between each request to avoid getting rate limited
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const game = await getGame(appId);

        // This is just a sneaky way to try and go through a large list of games without getting rate limited, and work around what happens when we do get rate limited
        if (game.error === 'Rate Limited') {
          console.log('Rate limited. Waiting for 5 minutes...');
          await new Promise((resolve) => setTimeout(resolve, 5 * 60 * 1000));
          console.log('Resuming...');
        }
      } catch (error) {
        console.error(error);
        return [
          { error: 'An unknown error occurred hen getting a list of games' },
        ];
      }
    }

    return { message: 'Finished getting list of games' };
  };

  /**
   * Fetches a game based on its appId.
   * If rateLimited is true, it returns an error.
   * @param {number} appId - The appId of the game.
   * @returns {Promise<GameResult>} A promise that resolves to a GameResult object.
   */
  const getGame = async (appId: number): Promise<GameResult> => {
    if (rateLimited) {
      return { error: 'Rate Limited' };
    }

    try {
      const response = await axios.get<Types.SteamAppDetailsResponse>(
        `https://store.steampowered.com/api/appdetails?appids=${appId}`
      );
      const gameData = response.data[appId].data;

      if (gameData?.name) {
        await insertGame({
          app_id: appId,
          provider_id: 1,
          name: gameData?.name,
          release_date: gameData?.release_date.date || '',
          image: gameData?.header_image || '',
          metacritic: gameData?.metacritic?.score || 0,
          price: gameData?.price_overview?.final || 0,
        });
        rateLimited = false;
        return { message: `Inserted App ${appId}` };
      } else {
        // Steam has apps that have no data, we still want to insert them into the database so we don't call them again
        insertGame({
          app_id: appId,
          provider_id: 1,
          name: '',
          release_date: '',
          image: '',
          metacritic: 0,
          price: 0,
        });
        rateLimited = false;
        return { message: `Inserted App ${appId}` };
      }
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const errResponse = error as ErrorResponse;
        console.error(errResponse.response);
        rateLimited = true;
        return { error: errResponse.response.status };
      }
      return { error: 'An unknown error occurred' };
    }
  };

  return { getListOfGames, getGame };
};
