import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import * as steam from './controllers/steam';
import userController from './controllers/user';
import {
  getAllUserProviders,
  getUsers,
  getUsersStats,
} from './database/dbQueries';

dotenv.config();

export const createServer: () => Express = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Creating the base user
  app.post('/v1/user/create', userController.createUser);

  // This will get the details for that user
  app.get('/v1/user/:userId', userController.getUserById);

  // Getting the stats from steam for the user
  // app.use('/steam/stats/:steamId', steam.user.getPlayerStats);
  // app.use('/steam/games/:steamId', steam.user.getOwnedGames);

  // If the user does not have their steamId they can use the steamOpenAi to authenticate themselves and log in that way to get it
  app.get('/v1/auth/steam', steam.auth.getSteamId);
  app.get('/v1/auth/steam/authenticate', steam.auth.redirect);

  // A bunch of routes that was used more for development for checking the database was working.
  // Went on to use a db management tool, but these could be handy for testing and the like
  app.get('/v1/users/', async (req, res) => {
    const usersRows = await getUsers();
    return res.json(usersRows);
  });
  app.get('/v1/users/stats', async (req, res) => {
    const usersRows = await getUsersStats();
    return res.json(usersRows);
  });
  app.get('/v1/users/provider', async (req, res) => {
    const usersRows = await getAllUserProviders();
    return res.json(usersRows);
  });

  return app;
};
