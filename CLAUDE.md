# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A multiplayer geographic board game platform where teams play location-based games (Connect Four, Snake, etc.) on real city maps. Players physically move to neighborhoods to complete challenges and claim territory. Built on boardgame.io for game state management and Google Maps for map rendering.

## Development Commands

```bash
# Frontend dev server (Vite on port 1234)
npm run dev

# Game server (boardgame.io server, requires .env.development)
npm run serve

# Build server for deployment
npm run build-server

# Type checking
npm run typecheck

# Compile SCSS
npm run sass

# Deploy to staging (Firebase)
npm run stage

# Deploy to production (Firebase)
npm run deploy
```

Environment files: `.env`, `.env.development`, `.env.staging` (managed via dotenvx).

## Architecture

### Three-Layer Structure

1. **`scripts/`** - Game logic (framework-agnostic, runs on both client and server)
   - `scripts/games/` - Game definitions using boardgame.io's `Game` interface
   - `scripts/games/shared_moves/` - Moves shared across all game types (player setup, team photos, game management)
   - `scripts/games/challenge_deck/` - Challenge card system shared by games
   - `scripts/types/` - Shared TypeScript types
   - `scripts/geojson/` - GeoJSON processing for map regions (lines, polygons, centers)

2. **`src/`** - React frontend (Vite + React 19 + Mantine UI)
   - `src/site/` - Top-level routing (`AppRouter.tsx`), landing pages
   - `src/lobby/` - Match creation, joining, game prep
   - `src/match/` - In-game UI: board rendering, map display, game screens
   - `src/userInterface/` - Reusable UI components
   - `src/styles/` - SCSS styles and Mantine theme

3. **`server/`** - Node.js game server
   - `server/server.ts` - boardgame.io Server with FlatFile DB, also proxies Google Maps KML data
   - `server/locationServer.ts` - Separate server for player location tracking

### Key Patterns

- **boardgame.io Game/Move pattern**: Games are defined in `scripts/games/<game>/` with a main file exporting a `Game` object. Moves are pure functions receiving `{G, ctx, ...}` context. Game state is the `G` object.
- **Adding a new game**: Define game in `scripts/games/<name>/`, register it in `server/server.ts`, add a board component in `src/match/Board.tsx`, add client creation in `src/match/Client.tsx`, and add metadata to `scripts/consts.ts`.
- **Path aliases**: `@/` = project root, `@scripts/` = `scripts/`, `@src/` = `src/`, `@data/` = `data/`, `@match/` = `src/match/`, `@styles/` = `src/styles/`, `@server/` = `server/`. Defined in both `tsconfig.json` and `src/vite.config.ts`.
- **Map data flow**: KML from Google My Maps -> server proxy (`/map-data/:citycode`) -> parsed to GeoJSON on client (`scripts/geojson/`) -> rendered on Google Maps.
- **City/map config**: Cities and their KML IDs are in `scripts/consts.ts`. Challenge data per city lives in `data/challenges/`.

### Currently Active Games

- **Connect Four** (`connect_four`) - Active. Teams claim neighborhoods to connect four in a row.
- **Snake** (`snake`) - Inactive. Teams grow a snake by collecting fruit on the map.
- Tag and Battleship are listed in consts but not implemented.

## Build System

The project is transitioning from Parcel to Vite. Use the Vite commands (`npm run dev`, `npm run vite-build`) for frontend development. Parcel config (`.parcelrc`, parcel scripts) still exists but Vite is primary. The server is built with esbuild.

## Deployment

Firebase Hosting serves the static frontend (`dist/` directory). The game server and location server are deployed separately. Firebase projects: `outside-2d699` (prod), `metro-game-474bc` (default/staging), `playground-dev-43a78` (dev).
