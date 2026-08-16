# Poké Planets

> A NASA-powered, turn-based RPG built with React, Express, PostgreSQL, and real exoplanet data.

Poké Planets is a browser-based role-playing game where players choose a planet, improve its statistics, purchase upgrades, care for it, and battle through a campaign of hostile exoplanets.

The project began as a frontend React application and was progressively enhanced into a full-stack application featuring modular state management, intelligent enemy decision-making, persistent user accounts, authentication, and relational database storage.

---

## Features

- Choose and develop a starter planet
- Generate enemies using NASA exoplanet data
- Turn-based combat with attack, evade, heal, and special abilities
- Enemy AI using heuristic decision-making and archetypes
- Enemy difficulty calculated with percentile-based normalization
- Purchase upgrades that permanently modify player statistics
- Increase affinity by caring for your planet
- Persistent player inventory
- PostgreSQL-backed account and game persistence
- Secure user registration and authentication
- Campaign progression and boss encounters
- Responsive React interface

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Context
- React Reducers
- CSS

### Backend

- Node.js
- Express
- REST APIs
- JWT Authentication
- bcrypt

### Database

- PostgreSQL
- Parameterized SQL
- Relational data modeling
- Database transactions
- Primary and foreign key constraints

### Development

- Docker
- Docker Compose
- Git / GitHub
- ESLint
- Vitest

### External Data

- NASA Image and Video Library API
- NASA Exoplanet Archive

---

## Enemy Intelligence

Enemy behavior goes beyond random action selection.

Poké Planets uses several algorithms and data structures to generate and control opponents:

- **Reservoir sampling** selects enemies from large datasets efficiently.
- **Percentile normalization** converts NASA exoplanet attributes into balanced game statistics.
- **Map-based deduplication** removes duplicate exoplanet records.
- **Threat scoring** estimates overall enemy difficulty.
- **Enemy archetypes** create different combat personalities.
- **Heuristic decision-making** evaluates actions using the current battle state.
- A **binary max-heap** ranks possible enemy actions by calculated score.

This allows enemies to make decisions based on health, damage potential, healing availability, defensive opportunities, special abilities, and current battle conditions.

---

## Persistence

Game data is stored in PostgreSQL and associated with individual user accounts.

Persistent data includes:

- Selected starter
- Player statistics
- Energy
- Affinity
- Inventory
- Shop purchases
- Campaign progress
- Boss victories

The browser stores only the authentication token required to access the player's server-side data.

---

## Security

Poké Planets includes several security-focused design decisions:

- Passwords are hashed using **bcrypt**
- Authentication uses signed **JSON Web Tokens**
- Protected API routes require a valid token
- User identity is derived from the verified token
- SQL queries use parameters rather than string concatenation
- Server-side validation is performed on incoming requests
- Database constraints protect data integrity
- Multi-step operations use transactions
- Environment variables protect database credentials and JWT secrets
- Existing player profiles cannot be overwritten by repeated starter selection

> **Important:** Never commit `.env` or `server/.env` files. Only `.env.example` files should be stored in the repository.

---

## Running Poké Planets Locally

### Requirements

Install:

- [Node.js](https://nodejs.org/)
- npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Docker Compose

### 1. Clone the Repository

```bash
git clone https://github.com/hyliangoat/YOUR-REPOSITORY-NAME.git
cd YOUR-REPOSITORY-NAME
```

### 2. Install Dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
npm --prefix server install
```

### 3. Configure Environment Variables

Create:

```text
.env
```

from:

```text
.env.example
```

Then create:

```text
server/.env
```

from:

```text
server/.env.example
```

Generate a secure value for:

```text
JWT_SECRET
```

Do not use the example secret in production.

### 4. Start PostgreSQL

```bash
docker compose up -d database
```

> Avoid `docker compose down -v` unless you intentionally want to delete all local database data.

### 5. Start the Backend

```bash
npm --prefix server run dev
```

Default API address:

```text
http://localhost:3001
```

### 6. Start the Frontend

```bash
npm run dev
```

Vite will normally provide:

```text
http://localhost:5173
```

---

## Development Commands

Run linting:

```bash
npm run lint
```

Run frontend tests:

```bash
npm test
```

Create a production build:

```bash
npm run build
```

Run backend tests:

```bash
npm --prefix server test
```

---

## Database Structure

| Table | Purpose |
|---|---|
| `users` | Account and authentication information |
| `player_profiles` | Starter, statistics, energy, and affinity |
| `shop_items` | Server-controlled upgrade catalog |
| `player_inventory` | Items owned by each player |
| `campaign_progress` | Campaign and boss completion data |

Primary keys, foreign keys, unique constraints, and validation constraints are used to maintain data integrity.

---

## Architecture

```text
NASA APIs
    │
    ▼
React + Vite Client
    │
    │ JSON / REST
    ▼
Node + Express API
    │
    │ Parameterized SQL
    ▼
PostgreSQL
```

The frontend is responsible for presentation and interaction, while the backend acts as the authority for authentication and persistent player data.

---

## CS 499 Capstone

Poké Planets was selected as my Computer Science capstone artifact and enhanced across three areas.

### 1. Software Design and Engineering

The enhancement introduced:

- Centralized React battle state
- Context and reducers
- Modular battle logic
- Reusable providers and hooks
- Improved API error handling
- Automated testing

### 2. Algorithms and Data Structures

Enemy generation and combat behavior were enhanced using:

- Binary max-heap priority queue
- Reservoir sampling
- Map-based deduplication
- Percentile normalization
- Threat scoring
- Enemy archetypes
- Heuristic AI decision-making

### 3. Databases

The final enhancement transformed the project into a full-stack system using:

- Express
- PostgreSQL
- Relational database design
- Persistent user accounts
- JWT authentication
- Password hashing
- Transactions
- Protected APIs
- Server-side validation

Together, these enhancements demonstrate the evolution of one application from a functional prototype into a more maintainable, intelligent, secure, and complete software system.

---

## Future Improvements

- Equipment and cosmetic loadouts
- Server-authorized battle sessions and rewards
- Additional campaigns and bosses
- Expanded planet-care mechanics
- Player profiles and achievements
- Leaderboards
- Additional NASA datasets
- Public deployment of the full backend and database

---


## Author

**Hyliangoat**

Computer Science · Software Development · Cybersecurity · Games · Creative Technology

- [GitHub](https://github.com/hyliangoat)
- [Portfolio](https://hyliangoat.github.io/)

---

## Acknowledgments

Planetary imagery and exoplanet information used by Poké Planets are sourced from publicly available NASA services and datasets.

---

**Explore strange worlds. Fight questionable planets. Try not to get obliterated by the Great Attractor.**
