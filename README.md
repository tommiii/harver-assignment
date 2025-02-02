# Candidate Matching System

A system that matches candidates to job vacancies based on their module scores and application timing.

## Setup

1. Install dependencies:
```bash
yarn install
```

This will install dependencies for both client and server applications.

## Available Scripts

In the root directory, you can run:

### `yarn dev`
Runs both the client and server in development mode concurrently.
- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:3000](http://localhost:3000)

### `yarn clean`
Removes all node_modules directories and build artifacts.

### `yarn lint`
Runs linting for all workspaces.

### `yarn lint:fix`
Runs linting and fixes auto-fixable issues for all workspaces.

### `yarn validate`
Runs all validation checks (currently runs lint).

## Individual Workspace Commands

You can run commands for individual workspaces using the workspace prefix:

```bash
# Client commands
yarn workspace client dev
yarn workspace client test

# Server commands
yarn workspace server dev
yarn workspace server test
```
