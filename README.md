MAP for Housing – Full-Stack Map Markers

Two-folder project: React (Vite, TypeScript, react-leaflet) frontend and Express + Prisma + PostgreSQL backend. Click the map to add places, store them in Postgres, and view popups. Uses OpenStreetMap tiles (no API keys).

Quick start

1. Backend (maps-backend)

- Create an .env file with:
  DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/maps_db?schema=public"
  PORT=4000
- Install and generate:
  cd maps-backend
  npm install
  npm run prisma:gen
- Migrate (creates tables):
  npm run prisma:migrate -- --name init
- Run:
  npm run dev

REST

- GET /api/places – list all (newest first)
- POST /api/places – create { name, description?, category?, lat, lng }
- DELETE /api/places/:id – delete by id

2. Frontend (maps-frontend)

- Create an .env file with:
  VITE_API_BASE=http://localhost:4000
- Install and run:
  cd maps-frontend
  npm install
  npm run dev
- Open http://localhost:5173

Notes

- Default center: Sydney (-33.8688, 151.2093), zoom 11.
- CORS allows http://localhost:5173 to talk to http://localhost:4000.
- If ports are busy, change them in the backend .env and frontend vite config/env.
