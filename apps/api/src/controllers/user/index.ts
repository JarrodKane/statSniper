import { Request, Response } from 'express';
import NodeCache from 'node-cache';
import { PROVIDERS_DICTIONARY } from '../../constants/providers';
import { getUserProviders, insertUser } from '../../database/dbQueries';
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
    const { userId } = req.params;
    const userIdPart = userId.split('=')[1];
    const usersCache = new NodeCache();
    const cacheKey = `user_${userId}`;

    if (usersCache) {
      const cachedUser = usersCache.get<Types.UserGameData[]>(cacheKey);
      if (cachedUser) {
        res.status(200).json(cachedUser);
      }
    }

    try {
      const usersGames = await userController.updateUser(Number(userIdPart));
      usersCache.set(cacheKey, usersGames, 120);
      res.status(200).json(usersGames);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const { userName } = req.body;
      await insertUser(userName);
      res.status(200).json({ message: 'User created' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  updateUser: async (userId: number) => {
    const providers = await getUserProviders(userId);
    const games: Record<string, Types.UserGameData[]> = { steam: [] };

    if (providers.length > 0) {
      await Promise.all(
        providers.map(async (provider) => {
          if (PROVIDERS_DICTIONARY[provider.provider_id] === 'steam') {
            try {
              const steamGames = await steam.user.getOwnedGames(
                provider.unique_Id
              );
              games.steam = steamGames;
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
