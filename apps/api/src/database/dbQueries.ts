import db from './index';

type Avatar = {
  small: string;
  medium: string;
  large: string;
};

// This is specific to steam, need to make it more generic
export const insertUser = async (username: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO user (name) VALUES (?)', [username], (err) => {
      if (err) {
        console.error('Error inserting user data:', err);
        reject('Error inserting user data');
      } else {
        console.log('User data inserted into the database');
        resolve('User data inserted into the database');
      }
    });
  });
};

export const insertProvider = async (
  providerName: string,
  providerUrl: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO provider (name, url) VALUES (?, ?)',
      [providerName, providerUrl],
      (err) => {
        if (err) {
          console.error('Error inserting provider data:', err);
          reject('Error inserting provider data');
        } else {
          console.log('Provider data inserted into the database');
          resolve('Provider data inserted into the database');
        }
      }
    );
  });
};

export const insertUserProvider = async (
  userId: number,
  providerId: number,
  providerUserId: string,
  name: string,
  avatar: Avatar
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO user_provider (user_id, provider_id, unique_Id, name, avatar) VALUES (?, ?, ?, ?, ?)',
      [userId, providerId, providerUserId, name, avatar],
      (err) => {
        if (err) {
          console.error('Error inserting user provider data:', err);
          reject('Error inserting user provider data');
        } else {
          console.log('User provider data inserted into the database');
          resolve('User provider data inserted into the database');
        }
      }
    );
  });
};

export const getAllGamesForUser = async (userId: number) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT game.*, user_game.*
      FROM game
      LEFT JOIN user_game ON game.id = user_game.game_id
      WHERE user_game.user_id = ?
    `;

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error('Error getting users:', err);
        reject('Error getting users');
      } else {
        console.log('Retrevied games from database');
        resolve(rows);
      }
    });
  });
};

export const getUserProviders = async (userId: number) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT user_provider.*
      FROM user_provider
      WHERE user_provider.user_id = ?
    `;

    db.all(sql, [userId], (err, rows) => {
      if (err) {
        console.error('Error getting users:', err);
        reject('Error getting users');
      } else {
        console.log('Users retrieved from the database');
        resolve(rows);
      }
    });
  });
};

export const checkIfGameExists = async (appId: string) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT *
      FROM game
      WHERE game.app_id = ?
    `;

    db.all(sql, [appId], (err, rows) => {
      if (err) {
        console.error('Error getting users:', err);
        reject('Error getting users');
      } else {
        resolve(rows);
      }
    });
  });
};

export const insertGame = async (
  appId: string,
  providerId: string,
  name: string,
  releaseDate: Date,
  image: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT OR IGNORE INTO game (app_id, provider_Id, name, release_date, image) VALUES (?, ?, ?, ?, ?)',
      [appId, providerId, name, releaseDate, image],
      (err) => {
        if (err) {
          console.error('Error inserting game data:', err);
          reject('Error inserting game data');
        } else {
          console.log('Game data inserted into the database');
          resolve('Game data inserted into the database');
        }
      }
    );
  });
};

// This is just a little fun to throw around
export const dropAllTables = async () => {
  const tablesToDrop = [
    'user',
    'provider',
    'user_provider',
    'user_game',
    'game',
  ];

  db.serialize(() => {
    tablesToDrop.forEach((table) => {
      db.run(`DROP TABLE IF EXISTS ${table}`);
    });
  });
};

// Put in for some manual testing of the DB
export const getUsers = async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM user', [], (err, rows) => {
      if (err) {
        console.error('Error getting users:', err);
        reject('Error getting users');
      } else {
        console.log('Users retrieved from the database');
        resolve(rows);
      }
    });
  });
};

export const getAllUserProviders = async () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM user_provider', [], (err, rows) => {
      if (err) {
        console.error('Error getting users:', err);
        reject('Error getting users');
      } else {
        console.log('Users retrieved from the database');
        resolve(rows);
      }
    });
  });
};

export const getUsersStats = async () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT user.*, user_provider.*
      FROM user
      LEFT JOIN user_provider ON user.id = user_provider.user_id
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error getting users:', err);
        reject('Error getting users');
      } else {
        console.log('Users retrieved from the database');
        resolve(rows);
      }
    });
  });
};
