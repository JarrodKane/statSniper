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

  // This will get the details for that user
  app.get('/v1/user/:userId', userController.getUserById);

  // If the user does not have their steamId they can use the steamOpenAi to authenticate themselves and log in that way to get it
  app.get('/v1/auth/steam', steam.auth.getSteamId);
  app.get('/v1/auth/steam/authenticate', steam.auth.redirect);

  // This was an idea to fetch all games and store them, it'll take too long for now
  // fetchAndInsertSteamAppsIntoDatabase();

  return app;
};
