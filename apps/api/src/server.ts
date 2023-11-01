import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { getOwnedGames, getPlayerStats } from './controllers/steam';

dotenv.config();

export const createServer: () => Express = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/steam/stats/:steamId', getPlayerStats);
  app.use('/steam/games/:steamId', getOwnedGames);

  return app;
};
