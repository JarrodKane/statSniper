import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import * as SharedTypes from 'shared-types';
import { PROVIDERS_DICTIONARY } from '../../constants/providers';
import {
  getUserProviders,
  insertUser,
  insertUserProvider,
} from '../../database/dbQueries';
import * as steam from '../steam';

const usersCache = new NodeCache();

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
    const cacheKey = `user_${userIdPart}`;
    if (usersCache) {
      const cachedUser = usersCache.get<SharedTypes.UserGameData[]>(cacheKey);
      if (cachedUser) {
        res.status(200).json(cachedUser);
      }
    }

    try {
      const usersGames = await userController.updateUser(userIdPart);
      usersCache.set(cacheKey, usersGames, 120);
      return res.status(200).json(usersGames);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },

  //TODO: Ideally this is made more generic to make a user but I converted it to only be taking a steamId for now
  // Right now it's a little redundant to be storing the steamId in the user table and the user_providers table
  // But I think it's fine for now, we can refactor later when we need
  createUser: async (req: Request, res: Response) => {
    const { steamId } = req.body;
    const cacheKey = `userCreate_${steamId}`;

    if (usersCache) {
      const cachedUser = usersCache.get<SharedTypes.UserGameData[]>(cacheKey);
      if (cachedUser) {
        return res.status(200).json(cachedUser);
      }
    }

    try {
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
        console.error('Error inserting user provider data');
      }

      const usersGames = await userController.updateUser(steamId);
      usersCache.set(cacheKey, usersGames, 120);
      return res.status(200).json(usersGames);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'An error occurred' });
    }
  },

  updateUser: async (steamId: string) => {
    const userProviders = await getUserProviders(steamId);

    const games: SharedTypes.UserGameStats = {
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
