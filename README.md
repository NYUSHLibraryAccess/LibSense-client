# LibSense client

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Frontend of NYU Shanghai Library WMS

[Changelog](CHANGELOG.md)

## Prerequisites

- `Node.js` >= `v16.15.1`
- `Yarn` >= `3.3.1`

## Commands

- `yarn install` - Install dependencies
- `yarn run start` - Start development server
- `yarn run build` - Build production bundle
- `yarn run analyze-bundle` - Build and analyze production bundle
- `yarn run type-check` - Run TypeScript type checking
- `yarn run lint` - Run ESLint, stylelint, and Prettier
- `yarn run lint:fix` - Run ESLint, stylelint, and Prettier and fix errors
- `yarn run commit` - Commit changes with [commitizen](http://commitizen.github.io/cz-cli/)
- `yarn run release` - Create a new release with [standard-version](https://github.com/conventional-changelog/standard-version)

## Tech Stack

- **Framework** - React
- **Page Routing** - [React Router](https://reactrouter.com/en/main)
- **State Management** - [@reduxjs/toolkit](https://redux-toolkit.js.org/)
- **UI Library** - [Ant Design](https://ant.design/)

## Building System

Bundler:

- **Bundler** - [webpack](https://webpack.js.org/)
- **Code Transpiler** - [Babel](https://babeljs.io/) ([Babel for transpiling, tsc for types](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html))

Linters:

- **JS/TS Linter** - [ESLint](https://eslint.org/)
- **CSS Linter** - [stylelint](https://stylelint.io/)
- **Code Prettier** - [Prettier](https://prettier.io/)

CI:

- **Local CI** - [Husky](https://typicode.github.io/husky/#/) + [lint-staged](https://github.com/okonet/lint-staged)
- **Commit Message Linter** - [commitlint](https://commitlint.js.org/)
- **Commit and Release Utilities** - [commitizen](http://commitizen.github.io/cz-cli/) + [standard-version](https://github.com/conventional-changelog/standard-version)

## Project Structure

- `patches` - Patches for dependencies
- `src` - Source code of the application
  - `assets` - Images and fonts
  - `components` - Components
  - `constants` - Constants of the application
  - `hooks` - React hooks
  - `routes` - Pages of the application
  - `services` - API of the RTK query
  - `slices` - Redux stores
  - `styles` - Style files
  - `templates` - HTML templates for the building system
  - `types` - Type definitions
  - `utils` - Utilities for the application
  - `app.less` - Global styles
  - `app.tsx` - Application entry point
  - `store.ts` - Global Redux store
  - `externals.d.ts` - Global TypeScript declarations
- `utils` - Utilities for the building system

## TODO List

- Containerize the application
- Replace session with token for authentication
- Review fallback values in the whole application for `undefined`, `null` and `''`
