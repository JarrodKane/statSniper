# Stat Sniper

Stat Sniper is a web application that allows users to sign into Steam and view their game stats. It is built using [Turborepo](https://turborepo.org/) in order to start a monorepo.
The app is made with the focus on being able to get steam games, but it could be expanded to other platforms.
It would require some rework, and needs more time put into storing users and their data before it could be expanded.

## Project Structure

```
The project is structured as follows:
├── apps
│ ├── api
│ └── web
├── packages
│ ├── shared-types
│ └── tsconfig
└── README.md
```

This project includes the following applications:

### API

This is a small express application that serves as the backend for our project. It communicates with the Steam API to fetch user game stats.
It's storing the games, and users in a sqlite database.

Right now it's going to have issues with getting additional data for the apps. This is due to the rate limiting on the steam api.
Ideally we would import a list of apps so that we can store the data we want in our database. This would allow us to get the data we want without having to make additional calls to the steam api.
We will also need to set the time for when to get updates, as currently if a game exists we don't update it. This is because we don't want to hit the rate limit.

We could also have lots of improvements by storing the users_games so that we don't need to do so many db calls.

- An Express application that serves as the backend for our project. It communicates with the Steam API to fetch user game stats.
- It uses a simple sqlite database to store user data. (This is not ideal and should be replaced with a better database, if we want to scale this project)
- Node cache is used to cache user data for 30 mins.

##### API Endpoints

'/v1/user/create'
Creates a user in the database - It then fetches that users owned games from steam, and grabs the game data that is in our database

###### Steam AppData

'/v1/steam/apps/:steamId'
Gets the list of games of a user, then will fetch the additional game info and insert that into our database.
Currently if it hits a rate limit it'll wait 5 mins before resuming, there's also a 2 second wait before calling the steam store.
This endpoint is really just for development, it's a way to fetch a large list of games that we don't have yet and cycle through them.
We don't want to be doing this when a user tries to search for their games, the 3rd party api would be hit too often, and would take too long to get the data.

There are a huge amount of apps to be found at, but for now I've opted to get the majority of games from user searches
`https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${apiKey}&include_games=true`
`https://api.steampowered.com/ISteamApps/GetAppList/v2/`

I think it's worth checking out 3rd party apis for this, as they may have better data, and be easier to work with to get the store data
https://steamapis.com/
https://steamdb.info/

#### Postman

I've added in an export of my postman collection for the API. You can import it into postman and use it to test the API.

### Web

A React Vite application that serves as the frontend for our project.
This is a single page application, originally I had planned to include multiple pages with the ability to use the steam login but I wanted to focus on the MVP.
I've used shadcn because I wanted to use a UI library that I haven't used before and tailwindscss works with it.
I've tried to keep the components basic and reusable.

Currently I'm only doing some basic component testing with cypress

- [shadcn](https://ui.shadcn.com) for component styling
- React Vite for development server and bundling
- Cypress for testing

Both applications are written in [TypeScript](https://www.typescriptlang.org/) for static type checking.

## Utilities

This project uses several tools to help with development:

- [TypeScript](https://www.typescriptlang.org/) for static type checking.
- [ESLint](https://eslint.org/) for code linting.
- [Prettier](https://prettier.io) for code formatting.
- [pnpm](https://pnpm.io/) for package management.
- [Turborepo](https://turborepo.org/) for monorepo management.
- [Vite](https://vitejs.dev/) for development server and bundling.
- [shadcn](https://ui.shadcn.com) for component styling.
- [Postman](https://www.postman.com/) for API testing.
- [Node Cache](https://www.npmjs.com/package/node-cache) for caching data.
- [SQLite](https://www.sqlite.org/index.html) for database.
- [Cypress](https://www.cypress.io/) for e2e testing.

## Running the Project

### ENV Variables

You need to add in a .env file into your apps/api folder with the following variables

```
STEAM_API_KEY=********
```

Developing the Project
To start development servers for all applications, navigate to the root directory of the project and run the following command:

```sh
pnpm install
pnpm dev
```

Vite frontend will be available at [http://localhost:5173](http://localhost:5173)
Express backend will be available at [http://localhost:3002](http://localhost:3002)

## Building the Project

To build all applications, navigate to the root directory of the project and run the following command:

```sh
pnpm build
```

## Todo List

- [x] tests fe
- [ ] tests be
- [x] Postman
- [ ] Codegen
- [x] API MVP

  - [x] Cache
  - [x] DB preload
  - [x] Rate limiting workaround (Very basic and not ideal)
  - [ ] Better error handling

- [x] FE MVP

## Features

These are features that would be cool to build

- [ ] User login through providers
- [ ] User profile
- [ ] Generation Fight (Figure out what generation you belong to by games you play)
- [ ] Hall of shame (Games you have never played)
- [ ] Cost of games (How much money you have spent on games)
- [ ] Buying habits (When you buy games the most is it seasonal etc)
- [ ] Favorite Genres
- [ ] Compare to friends
  - [ ] Compare and find games you can play together
- [ ] Better DB
- [ ] Hosting
