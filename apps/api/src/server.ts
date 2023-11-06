import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import * as steam from './controllers/steam';
import userController from './controllers/user';

dotenv.config();

export const createServer: () => Express = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Creating the base user
  app.post('/v1/user/create', userController.createUser);

  // We use this to grab the users games from steam and put them in
  app.get('/v1/steam/apps/:steamId', steam.user.getMissingOwnedGames);

  // TODO: Implement this to get the users steamId from the database
  // app.get('/v1/auth/steam', steam.auth.getSteamId);
  // app.get('/v1/auth/steam/authenticate', steam.auth.redirect);

  return app;
};
