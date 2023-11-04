import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { PROVIDERS_DICTIONARY } from '../../constants/providers';
import {
  getUserProviders,
  insertUser,
  insertUserProvider,
} from '../../database/dbQueries';
import * as Types from '../../types';
import * as steam from '../steam';

/**
 * userController is an object that contains methods for fetching, creating, and updating user data.
 * Note: There should be other crud operations such as deleting users and the like
 * @namespace userController
 */
const userController = {
  /**
   * Fetches user data by ID and sends it in the response.
   * This is the main function we have right now, it's going to collect all the data for that user
   * The results are cached for 2 minutes to reduce the number of API calls.
   *
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @memberof userController
   */
  getUserById: async (req: Request, res: Response) => {
    const { steamId } = req.params;

    const userIdPart = steamId.split('=')[1];
    const usersCache = new NodeCache();
    const cacheKey = `user_${userIdPart}`;

    if (usersCache) {
      const cachedUser = usersCache.get<Types.UserGameData[]>(cacheKey);
      if (cachedUser) {
        res.status(200).json(cachedUser);
      }
    }

    try {
      const usersGames = await userController.updateUser(userIdPart);
      // TODO: Uncomment this when when deploying
      // usersCache.set(cacheKey, usersGames, 120);
      res.status(200).json(usersGames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const { steamId } = req.body;
      await insertUser(steamId);

      // This bit is kinda messy here, right now as well we only insert the one type of provider which is steam and it's hard coded in.
      // This is rather nasty but works for now
      const insertSteamProvider = await insertUserProvider({
        user_id: steamId,
        provider_id: 1,
        unique_Id: steamId,
        name: 'test',
        avatar: 'test',
      });

      if (!insertSteamProvider) {
        res.status(500).json({ error: 'Error inserting user provider data' });
      }

      res.status(200).json({ message: 'User created' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  updateUser: async (steamId: string) => {
    const userProviders = await getUserProviders(steamId);

    const games: Types.UserGameStats = {
      steam: { totalPlayTime: 0, games: [] },
    };

    if (userProviders.length > 0) {
      await Promise.all(
        userProviders.map(async (provider) => {
          if (PROVIDERS_DICTIONARY[provider.provider_id] === 'steam') {
            try {
              const steamGames = await steam.user.getOwnedGames(
                provider.user_id
              );
              if (steamGames && 'games' in steamGames) {
                games[PROVIDERS_DICTIONARY[provider.provider_id]] = steamGames;
              }
            } catch (error) {
              console.error(error);
            }
          }
        })
      );
    }

    return games;
  },
};

export default userController;
