import { Request, Response } from 'express';
import { PROVIDERS_DICTIONARY } from '../../constants/providers';
import { getUserProviders, insertUser } from '../../database/dbQueries';
import * as Types from '../../types';
import * as steam from '../steam';

const userController = {
  getUserById: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userIdPart = userId.split('=')[1];

      const usersGames = await userController.updateUser(Number(userIdPart));
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
