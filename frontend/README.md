# CUET Exam Frontend

React + Vite single-page app with Tailwind styling and a lightweight authentication flow.

## Available pages

- `/` – Landing page with hero section and call-to-action button.
- `/auth/login` – Email/password login screen styled to match the provided mockup.
- `/auth/signup` – Registration form that collects name, email, phone, and password.

## Getting started

```bash
npm install
npm run dev
```

Set the API URL with `VITE_API_BASE_URL` if your backend runs somewhere other than `http://localhost:5000`.

## Quality checks

```bash
npm run lint
```

The app ships with ESLint + React hooks rules.
