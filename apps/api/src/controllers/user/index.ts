import { Request, Response } from 'express';
import { PROVIDERS_LIST } from '../../constants/providers';
import {
  // getAllGamesForUser,
  getUserProviders,
  insertProvider,
  insertUser,
} from '../../database/dbQueries';
import * as steam from '../steam';

// Define the user controller
const userController = {
  // Function to get a single user by ID
  getUserById: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const userIdPart = userId.split('=')[1];
      // const userGames = await getAllGamesForUser(Number(userIdPart));

      await userController.updateUser(userIdPart);
      res.status(200).json({ message: 'User updated' });
      // res.status(200).json({ userGames });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }

    // We check if there's any information first in the database

    // Then if there is not, we go to fetch the information from the provider
    // store that data
    // return data from the database
  },

  // Function to create a new user
  createUser: async (req: Request, res: Response) => {
    try {
      const { userName } = req.body;
      await insertUser(userName);
      await insertProvider('steam', 'steam.com');
      res.status(200).json({ message: 'User created' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  updateUser: async (userId: string) => {
    const providers = await getUserProviders(Number(userId));
    console.log(providers);
    const games = [];
    if (providers.length > 0) {
      await Promise.all(
        providers.map(async (provider) => {
          if (PROVIDERS_LIST[provider.provider_id] === 'steam') {
            const providerGames = await steam.user.getOwnedGames(
              provider.unique_Id
            );
            games.push(providerGames);
          }
        })
      );
    }

    // if (games.length > 0) {
    //   await Promise.all(
    //     games.map(async (game) => {
    //       await Promise.all(
    //         game.response.games.map(async (game) => {
    //           const gameData = await steam.game.getGame(game.appid);
    //           console.log(gameData);
    //         })
    //       );
    //     })
    //   );
    // }

    return providers;
  },

  // Function to delete a user
  deleteUser: (req: Request, res: Response) => {
    // Code to delete a user
  },
};

export default userController;
