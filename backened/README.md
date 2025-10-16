# CUET Exam Backend

Express + MongoDB API that powers the authentication flow.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and update the values.

```powershell
Copy-Item .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

The API listens on `http://localhost:5000` by default and exposes two endpoints:

- `POST /api/auth/register` – Create a new user with `name`, `email`, `password`, and optional `phone`.
- `POST /api/auth/login` – Authenticate an existing user with `email` and `password`.

A simple health-check is available at `GET /health`.
