# Ledgerly Finance Dashboard

Ledgerly is a full-stack personal finance dashboard with JWT authentication, PostgreSQL-backed transactions, CSV imports, spending categories, and a responsive React dashboard.

## Requirements

- Node.js 18+
- PostgreSQL 14+

## Setup

1. Create a PostgreSQL database named `finance_dashboard` and ensure PostgreSQL is running on port `5432`.
2. Copy `backend/.env.example` to `backend/.env`. Set `DATABASE_URL` and a strong `JWT_SECRET`.
3. Copy `frontend/.env.example` to `frontend/.env` if the API is not running at `http://localhost:5000/api`.
4. Start the API:

```bash
cd backend
npm install
npm run dev
```

5. In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The API creates its tables on startup. CSV files should include `description`, `amount`, and `date` columns. An optional `type` column can be `income` or `expense`; negative amounts are treated as income.

## Structure

- `backend/src/config`: PostgreSQL connection and table initialization
- `backend/src/routes`: authentication, transaction import, and budget endpoints
- `frontend/src/components`: dashboard, chart, transaction, and upload UI
- `frontend/src/context`: persisted JWT session state

## Deployment

Deploy the frontend to Vercel and keep the Express API and PostgreSQL database on Render.

### Vercel frontend

1. Import this repository into Vercel.
2. Set the project root directory to `frontend`.
3. Use the default Vite settings: build command `npm run build`, output directory `dist`.
4. Add `VITE_API_URL` with the deployed API URL, including `/api`, for example `https://ledgerly-api.onrender.com/api`.
5. Redeploy after saving the environment variable.

The `frontend/vercel.json` rewrite keeps React Router routes working on refresh.

### Render backend

1. Create a PostgreSQL database and a Node web service rooted at `backend`.
2. Use `npm install` as the build command and `npm start` as the start command.
3. Set `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, and `CLIENT_URL` to the exact Vercel URL. Multiple frontend URLs can be separated by commas.
4. Check `https://YOUR-API-DOMAIN/api/health` before testing login from the frontend.

The root `render.yaml` describes the backend and database connection, but its `CLIENT_URL` placeholder must be replaced with the real Vercel domain.