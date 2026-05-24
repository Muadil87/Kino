# Kino Project Structure

## Root

- `backend/`: Laravel API app (auth, routes, models, migrations, tests).
- `frontend/`: React app (UI, routing, API consumption, tests).
- `docs/`: Project documentation (architecture, folder guide, workflow).

## Backend (Laravel API)

- `app/`: Core backend code.
- `app/Http/Controllers/`: Request handlers for API endpoints.
- `app/Models/`: Eloquent models mapped to database tables.
- `bootstrap/`: Laravel bootstrap files.
- `config/`: Framework and app configuration (database, auth, cors, etc).
- `database/migrations/`: Database schema history.
- `database/seeders/`: Seed scripts for sample/initial data.
- `database/factories/`: Test data factories.
- `public/`: Web entry point (`index.php`).
- `routes/api.php`: API routes used by React.
- `routes/web.php`: Minimal health route.
- `storage/`: Logs, cache, sessions, temporary files.
- `tests/`: Unit and feature tests.
- `vendor/`: Composer dependencies (auto-generated).
- `.env`: Local runtime secrets/config.
- `.env.example`: Shared template for teammates.

## Frontend (React)

- `public/`: Static assets served as-is.
- `src/main.jsx`: React entry point.
- `src/App.jsx`: App shell and route tree.
- `src/components/`: Reusable UI components.
- `src/pages/`: Route-level screens.
- `src/services/`: External API clients and data services.
- `src/utils/`: Shared utility helpers.
- `src/assets/`: App images/icons.
- `src/__tests__/`: Frontend tests.
- `dist/`: Production build output (auto-generated).

## Important Note

- Backend is now API-only. Laravel frontend scaffold files (`backend/resources`, `backend/vite.config.js`, backend npm files) were intentionally removed.
