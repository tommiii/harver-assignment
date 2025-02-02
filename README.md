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

### `yarn type-check`
Runs TypeScript type checking for all workspaces.

### `yarn test`
Runs tests for all workspaces.

### `yarn validate`
Runs all code quality checks in sequence:
- Linting: Ensures code follows style guidelines and catches potential errors
- Type checking: Verifies TypeScript types are correct across all workspaces
This command is useful before committing changes or as part of CI/CD pipelines.

## Individual Workspace Commands

You can run commands for individual workspaces using the workspace prefix:

```bash
# Client commands
yarn workspace client dev
yarn workspace client build
yarn workspace client lint
yarn workspace client type-check
yarn workspace client test           # Run tests once
yarn workspace client test:coverage  # Run tests with coverage report

# Server commands
yarn workspace server dev
yarn workspace server test
yarn workspace server type-check
```

## Testing

The project uses Vitest and React Testing Library for testing. The client application includes tests for:

- Components: Testing rendering and interactions
- Containers: Testing form submissions, API calls, and error handling
- Utils: Testing helper functions

To run tests in watch mode (useful during development):
```bash
cd client
yarn test --watch
```

To generate a coverage report:
```bash
cd client
yarn test:coverage
```

## Project Rules

### Input Data
- Module Scores: 0-100 with max 2 decimal places
- IDs: Must be in ObjectId format
- Hiring Limit: Must be below 1,000,000

### Matching Logic
- Candidates are matched based on their average module scores
- For equal scores, earlier applications take precedence
- Each vacancy has a hiring limit
- 'X' marks are excluded from score calculations
