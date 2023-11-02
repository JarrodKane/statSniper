import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express } from 'express';
import * as steam from './controllers/steam';
import db from './database/index';

dotenv.config();

db.all('SELECT 1', [], (err, rows) => {
  if (err) {
    // Handle any database errors here
    console.error('Database error:', err);
    return;
  }

  // 'rows' will be an empty array because the query has no side effects and doesn't return any specific data
  // You can ignore the result, or perform any necessary actions here
});

export const createServer: () => Express = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/steam/stats/:steamId', steam.user.getPlayerStats);
  app.use('/steam/games/:steamId', steam.user.getOwnedGames);
  app.get('/auth/steam', steam.auth.getSteamId);
  app.get('/auth/steam/authenticate', steam.auth.redirect);
  app.get('/users/:userId', (req, res) => {
    const userId = req.params.userId;

    db.get('SELECT * FROM user WHERE id = ?', [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(row);
    });
  });

  return app;
};
