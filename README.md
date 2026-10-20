# Racer Bay

A small top-down multiplayer racing prototype built with Vite, Canvas, Express, and Socket.IO.

## Project layout

- `client/` — Vite browser game
- `server/` — Express + Socket.IO realtime server

## Run locally

Requires Node.js 20+.

1. Start the server:
   ```sh
   cd server
   npm install
   npm start
   ```
   The server listens on port 3001 (or the `PORT` environment variable).

2. In another terminal, start the client:
   ```sh
   cd client
   npm install
   npm run dev
   ```
   Open the Vite URL (normally http://localhost:5173). Join with a driver name and room code. Open another browser tab and use the same room code to test multiplayer.

## Deploy

- **Render:** create a Web Service from this repo, set Root Directory to `server`, Build Command to `npm install`, and Start Command to `npm start`.
- **Vercel:** import this repo, set Root Directory to `client`, and add `VITE_SERVER_URL` with the deployed Render service URL before deploying.

The current prototype uses simple shared room state and basic steering; it is a starting point, not a finished race/gameplay system.
