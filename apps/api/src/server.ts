import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import { getPlayerStats } from './controllers/steam';

dotenv.config();

export const createServer: () => Express = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/steam/stats', getPlayerStats);

  return app;
};
