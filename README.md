# Minimal Express server

This repository now includes a tiny Express server for development and testing.

How to run (PowerShell / Windows):

1. Install dependencies:

   npm install

2. Start the server:

   npm start

   or for automatic reload during development (requires nodemon):

   npm run dev

3. Verify:

   Invoke-RestMethod http://localhost:3000/

Endpoints:
- GET /         -> { message: 'Hello from Express server' }
- GET /health   -> { status: 'ok' }
