# Ledgerly

Ledgerly is a full-stack personal finance dashboard built with React, Express, and PostgreSQL. It helps users track spending, review monthly trends, manage budgets, and import CSV transaction data from banking exports.

## Live Demo

- Frontend: https://YOUR-FRONTEND.onrender.com
- API: https://YOUR-BACKEND.onrender.com

## Screenshot

![Ledgerly dashboard](docs/dashboard.png)

## Features

- [x] Secure signup and login with JWT authentication
- [x] Demo account onboarding for quick exploration
- [x] Dashboard overview with spending summaries
- [x] Transaction tracking and filtering
- [x] Budget categories and monthly budget tracking
- [x] CSV import for transaction uploads
- [x] Category-based organization
- [x] Local persistence for auth session state
- [ ] Dark mode polish
- [ ] More advanced trend insights and forecasting

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express
- Database: PostgreSQL
- Auth: JWT + bcrypt
- File parsing: csv-parser + multer

## Project Structure

```text
.
├── backend/
│   ├── src/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── dashboard.png
├── README.md
├── render.yaml
└── LICENSE
```

## API Overview

The backend exposes a JSON API under `/api` and uses bearer-token auth for protected routes. This repo’s backend includes health, auth, transactions, and budget endpoints.

### Auth

- `POST /api/auth/signup` — create a new user
- `POST /api/auth/login` — log in and receive a JWT
- `POST /api/auth/demo` — create or reuse a demo account

### Transactions

- `GET /api/transactions` — fetch the current user’s transactions
- `POST /api/transactions` — create a manual transaction
- `PATCH /api/transactions/:id/category` — update a transaction category
- `DELETE /api/transactions/:id` — delete a transaction
- `POST /api/transactions/upload` — upload a CSV file with form field `file`

### Categories and Budgets

- `GET /api/budgets/categories` — fetch category list
- `POST /api/budgets/categories` — create a category
- `PATCH /api/budgets/categories/:id/budget` — set a monthly budget
- `GET /api/budgets/summary` — retrieve budget vs. actual summary

### Health

- `GET /api/health` — server status

## CSV Format

CSV uploads are parsed from a simple banking export format. The supported fields in this repo are:

```csv
Description,Amount,Date
Groceries,42.50,2026-09-07
Netflix,15.99,2026-09-10
Salary,2200.00,2026-09-01
```

Notes:

- `Description` and `Amount` are required.
- `Date` is required in a parseable date format.
- The parser expects the common `Description`, `Amount`, and `Date` columns used by the app.
- If a deployed backend still runs an older API version, align the route names and CSV columns to that version before publishing.

## Local Setup

```bash
git clone https://github.com/Ssay2/Full-stack1-project.git
cd Full-stack1-project/frontend/finance-dashboard

cd backend
npm install
cp .env.example .env

cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Then run the backend in one terminal and the frontend in another.

## Deployment

This project is designed to deploy as:

- Backend: Render Web Service
- Frontend: Render Static Site

### Backend environment variables

- `DATABASE_URL`
- `JWT_SECRET`
- `NODE_ENV=production`
- `FRONTEND_URL=https://YOUR-FRONTEND.onrender.com`

### Frontend environment variables

- `VITE_API_URL=https://YOUR-BACKEND.onrender.com`

Also make sure the static site has this rewrite rule:

- `/*` → `/index.html` with rewrite action

## Roadmap

- [x] User auth and demo login
- [x] Budget tracking
- [x] CSV import
- [x] Dashboard overview
- [ ] Dark mode refinement
- [ ] More advanced analytics and trend summaries
- [ ] Improved category insights

## What I learned

This project taught me how much the deployment layer matters as much as the app code itself. The hardest part was making sure the correct backend and frontend roots were used, the environment variables matched, and the API was separated cleanly from the SPA. I also learned how important it is to verify the actual deployed path in the browser and logs instead of assuming the code alone is enough.

## License

This project is licensed under the MIT License.
