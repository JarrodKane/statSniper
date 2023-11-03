/**
 * @file Database Initialization
 * @description This file initializes the SQLite database for the Sniper application.
 * It defines tables for users, providers, user-provider relationships, user-game relationships, and games.
 * The database structure supports user and game data, as well as their relationships.
 *
 * I've kept it basic for the providers and games, there will be issues with games that exist in multiple providers.
 *
 * @requires sqlite3
 * @exports db - An SQLite database instance for use in the application.
 */

import sqlite3 from 'sqlite3';
import { insertProvider } from './dbQueries';

const db = new sqlite3.Database(
  'sniper.db',
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
);

db.run(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE
  )
`);

//  TODO: This is a bit of a hack, I'm just inserting the provider here, since it's the only one I'm using right now.
db.run(
  `
  CREATE TABLE IF NOT EXISTS provider (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE,
    url TEXT UNIQUE
  )
`,
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      insertProvider({ name: 'steam', url: 'steam.com' }).catch(console.error);
    }
  }
);

// This is needed for when a user signs into a provider, we just want to say that they belong to that provider.
// They might have a uniqueId for that provider, but we don't want to store that in the user table.
db.run(`
CREATE TABLE IF NOT EXISTS user_provider (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  provider_id INTEGER,
  unique_Id TEXT,
  name TEXT,
  avatar TEXT,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (provider_id) REFERENCES provider(id)
)
`);

// The same game might exist in multiple providers.
// For now I'm treating each provider as a separate game. But will need a way to collapse them into one game.

db.run(`
  CREATE TABLE IF NOT EXISTS game (
    id INTEGER PRIMARY KEY,
    app_id INTEGER UNIQUE,
    provider_id INTEGER,
    name TEXT,
    release_date DATE,
    image TEXT,
    FOREIGN KEY (provider_id) REFERENCES provider(id)
  )
`);

// TODO: This would be good to use, but right now we are not storing the users data, we reach for it each time unless it is in cache
db.run(`
  CREATE TABLE IF NOT EXISTS user_game (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    game_id INTEGER,
    hours_played INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (game_id) REFERENCES game(id)
  )
`);

export default db;
