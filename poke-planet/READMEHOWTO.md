Running the Project

Poké Planets requires Node.js, npm, Docker Desktop, and Docker Compose. After downloading the repository, copy .env.example to .env and server/.env.example to server/.env. Replace the example JWT secret in server/.env with a secure local value. Then install the frontend and backend dependencies:

npm install
npm --prefix server install

Start PostgreSQL, the Express API, and the React client in separate terminals:

docker compose up -d database
npm --prefix server run dev
npm run dev

Open the address provided by Vite, normally http://localhost:5173. Do not upload the completed .env files because they contain local credentials and security secrets.