# Candidate Matching System

A system that matches candidates to job vacancies based on their module scores and application timing.

## Project Structure

```
.
├── client/               # Frontend React application
│   ├── src/              # Source files
│   ├── dist/             # Build output
│   ├── .env.example      # Example environment variables
│   └── .env              # Local environment variables (not in git)
├── server/               # Backend Node.js application
│   ├── src/              # Source files
│   ├── dist/             # Build output
│   ├── .env.example      # Example environment variables
│   └── .env              # Local environment variables (not in git)
└── package.json          # Root package.json for workspaces
```

## Prerequisites

- Node.js (v22)
- Yarn Classic (v1.22.x)

## Setup

1. Install Yarn Classic (v1):

```bash
npm install -g yarn@1.22.19
```

Verify the installation:
```bash
yarn --version  # Should show 1.22.x
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

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

### `yarn install`

Install all the dependencies for both client and server. With Yarn Classic, this will:
- Install dependencies for all workspaces
- Generate a `yarn.lock` file for dependency resolution
- Create necessary workspace symlinks

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

With Yarn Classic workspaces, you can run commands for individual workspaces using the workspace prefix:

```bash
# Client commands
yarn workspace client dev            # Start development server
yarn workspace client build          # Build for production
yarn workspace client preview        # Serve the production build
yarn workspace client lint           # Run ESLint
yarn workspace client lint:fix       # Fix auto-fixable ESLint issues
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

## Yarn Classic Commands

Useful Yarn Classic (v1) specific commands:

```bash
# Dependency management
yarn add <package>                # Add a package to current workspace
yarn remove <package>             # Remove a package from current workspace
yarn upgrade                      # Upgrade all dependencies
yarn upgrade <package>            # Upgrade specific package
yarn upgrade-interactive         # Interactive upgrade of dependencies

# Workspace management
yarn workspaces info            # Show information about workspaces
yarn workspace <name> <command> # Run a command in a specific workspace

# Troubleshooting
yarn why <package>              # Show why a package is installed
yarn list                      # List installed packages
yarn check                     # Verify package dependencies
yarn cache clean              # Clean the global cache
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

## Troubleshooting

If you encounter any issues with dependencies:

1. Clear Yarn's cache:
```bash
yarn cache clean
```

2. Remove node_modules and reinstall:
```bash
yarn clean
yarn install
```

3. Check for dependency issues:
```bash
yarn check
```

4. If you see integrity check failures:
```bash
yarn install --force
```

5. For workspace-specific issues:
```bash
yarn workspace <workspace-name> clean
yarn workspace <workspace-name> install
```
