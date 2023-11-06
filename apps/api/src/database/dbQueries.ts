import * as Types from '../types';
import db from './index';

// This is specific to steam, but we could have other providers in the future
export const insertUser = async (steamId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO  user (name) VALUES (?)',
      [steamId],
      (err) => {
        if (err) {
          console.error('Error inserting user data:', err);
          reject('Error inserting user data');
        } else {
          resolve('User data inserted into the database');
        }
      }
    );
  });
};

export const insertProvider = async (
  providerData: Types.ProviderData
): Promise<string> => {
  const { name, url } = providerData;

  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO provider (name, url) VALUES (?, ?)',
      [name, url],
      (err) => {
        if (err) {
          console.error('Error inserting provider data:', err);
          reject('Error inserting provider data');
        } else {
          resolve('Provider data inserted into the database');
        }
      }
    );
  });
};

export const insertUserProvider = async (
  userProviderData: Omit<Types.UserProviderData, 'id'>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const { user_id, provider_id, unique_Id, name, avatar } = userProviderData;
    db.run(
      'INSERT OR IGNORE INTO  user_provider (user_id, provider_id, unique_Id, name, avatar) VALUES (?, ?, ?, ?, ?)',
      [user_id, provider_id, unique_Id, name, avatar],
      (err) => {
        if (err) {
          console.error('Error inserting user provider data:', err);
          reject('Error inserting user provider data');
        } else {
          resolve('User provider data inserted into the database');
        }
      }
    );
  });
};

export const getUserProviders = async (
  userId: string
): Promise<Types.UserProviderData[]> => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT user_provider.*
      FROM user_provider
      WHERE user_provider.user_id = ?
    `;

    db.all(sql, [userId], (err, rows: Types.UserProviderData[]) => {
      if (err) {
        console.error('Error getting users:', err);
        reject('Error getting users');
      } else {
        resolve(rows);
      }
    });
  });
};

export const getGameByAppId = async (
  appId: number
): Promise<Types.GameData[]> => {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT *
        FROM game
        WHERE game.app_id = ?
      `;

    db.all(sql, [appId], (err, rows: Types.GameData[]) => {
      if (err) {
        console.error('Error getting game data:', err);
        reject('Error getting game data');
      } else {
        resolve(rows);
      }
    });
  });
};

export const getGamesListByAppId = async (
  appIds: number[]
): Promise<Types.GameData[]> => {
  const placeholders = appIds.map(() => '?').join(',');

  return new Promise((resolve, reject) => {
    const sql = `
        SELECT *
        FROM game
        WHERE game.app_id IN (${placeholders})
      `;

    db.all(sql, [...appIds], (err, rows: Types.GameData[]) => {
      if (err) {
        console.error('Error getting game data:', err);
        reject('Error getting game data');
      } else {
        resolve(rows);
      }
    });
  });
};

export const insertGame = async (
  gameData: Omit<Types.GameData, 'id'>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const {
      app_id,
      provider_id,
      name,
      release_date,
      image,
      metacritic,
      price,
    } = gameData;
    db.run(
      'INSERT OR IGNORE INTO game (app_id, provider_Id, name, release_date, image, metacritic, price) VALUES (?, ?, ?, ?, ?, ? ,?)',
      [app_id, provider_id, name, release_date, image, metacritic, price],
      (err) => {
        if (err) {
          console.error('Error inserting game data:', err);
          reject('Error inserting game data');
        } else {
          resolve('Game data inserted into the database');
        }
      }
    );
  });
};

// Super quick drop table function for testing etc
export const dropTable = async (tableName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run(`DROP TABLE ${tableName}`, (err) => {
      if (err) {
        console.error('Error dropping table:', err);
        reject('Error dropping table');
      } else {
        resolve('Table dropped');
      }
    });
  });
};
