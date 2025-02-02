# Candidate Matching System

A system that matches candidates to job vacancies based on their module scores and application timing.

## Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   ├── dist/              # Build output
│   ├── .env.example       # Example environment variables
│   └── .env              # Local environment variables (not in git)
├── server/                # Backend Node.js application
│   ├── src/              # Source files
│   ├── dist/             # Build output
│   ├── .env.example      # Example environment variables
│   └── .env              # Local environment variables (not in git)
└── package.json          # Root package.json for workspaces
```

## Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- Git

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
```bash
# In client directory
cp .env.example .env

# In server directory
cp .env.example .env
```

### Environment Variables

#### Client
- `VITE_API_URL`: The base URL for the API (default: http://localhost:3000/api)

#### Server
- `PORT`: The port number for the server (default: 3000)
- `CORS_ORIGIN`: Allowed origin for CORS (default: http://localhost:5173)
- `MAX_FILE_SIZE`: Maximum file upload size in bytes (default: 5MB)

Note: Never commit `.env` files to git. Only `.env.example` files should be committed.

## Development

### Available Scripts

In the root directory, you can run:

### `yarn dev`
Runs both the client and server in development mode concurrently.
- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:3000](http://localhost:3000)

### `yarn build`
Builds both client and server applications for production.
- Client: Builds a static version of the React app
- Server: Compiles TypeScript to JavaScript in the `dist` directory

### `yarn start`
Starts both applications in production mode after building.
- Client: Serves the built static files using Vite's preview server
- Server: Runs the compiled JavaScript from the dist directory

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
yarn workspace client dev            # Start development server
yarn workspace client build          # Build for production
yarn workspace client preview        # Serve the production build
yarn workspace client lint           # Run ESLint
yarn workspace client type-check     # Run type checking
yarn workspace client test           # Run tests once
yarn workspace client test:coverage  # Run tests with coverage report

# Server commands
yarn workspace server start:dev      # Start server with hot-reload (development)
yarn workspace server build          # Build TypeScript to JavaScript
yarn workspace server start          # Start the production server
yarn workspace server lint           # Run ESLint
yarn workspace server lint:fix       # Fix auto-fixable ESLint issues
yarn workspace server test           # Run tests once
yarn workspace server test:watch     # Run tests in watch mode
yarn workspace server type-check     # Run TypeScript type checking
```

## Building and Running for Production

To prepare and run the application for production:

1. Build both applications:
```bash
yarn build
```

2. The build process will:
   - Client: Create an optimized production build in `client/dist`
   - Server: Compile TypeScript to JavaScript in `server/dist`

3. Start both applications in production mode:
```bash
yarn start
```

This will:
- Start the server using the compiled JavaScript
- Serve the client build using Vite's preview server

### Production Deployment Considerations

1. Environment Configuration:
   - Set up appropriate environment variables for production
   - Never commit `.env` files to version control
   - Use proper secrets management in production

2. Server Setup:
   - Replace the client preview server with a proper web server (nginx, Apache, etc.)
   - Run the server using a process manager (PM2, systemd, etc.)
   - Configure proper security headers and CORS settings
   - Set up proper logging and monitoring

3. Security:
   - Configure CORS appropriately for your production domain
   - Set up proper rate limiting
   - Configure file upload limits
   - Use HTTPS in production

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

## Version Control

### Git Ignore Rules
The project includes specific rules for ignoring files:

- Environment files (`.env`, `.env.local`, `.env.*.local`)
- Build directories (`dist/`)
- Dependencies (`node_modules/`)
- Coverage reports (`coverage/`)
- Editor-specific files
- Log files

Note: `.env.example` files are committed to provide templates for environment setup.
