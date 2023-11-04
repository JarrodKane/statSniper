# Stat Sniper

Stat Sniper is a web application that allows users to sign into Steam and view their game stats. It is built using [Turborepo](https://turborepo.org/) in order to start a monorepo.

## Project Structure

The project is structured as follows:
├── apps
│ ├── api
│ └── web
├── packages
│ ├── shared-types
│ └── tsconfig
└── README.md

This project includes the following applications:

### API

- An Express application that serves as the backend for our project. It communicates with the Steam API to fetch user game stats.
- It uses a simple sqlite database to store user data.
- Node cache is used to cache user data for 30 mins.

### Web

A React Vite application that serves as the frontend for our project

- [shadcn](https://ui.shadcn.com) for component styling
- React Vite for development server and bundling

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

## Running the Project

Developing the Project
To start development servers for all applications, navigate to the root directory of the project and run the following command:

```sh
pnpm install
pnpm dev
```

Vite frontend will be available at http://localhost:5173
Express backend will be available at http://localhost:3002

## Building the Project

To build all applications, navigate to the root directory of the project and run the following command:

```sh
pnpm build
```

## Todo List

- [ ] tests fe
- [ ] tests be
- [ ] API documentation
- [ ] Codegen
- [x] API MVP
  - [ ] Cache
  - [ ] DB preload
  - [ ] Rate limiting workaround
- [x] FE MVP
