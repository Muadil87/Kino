# Kino Development Workflow

## 1. Start Backend

From `backend/`:

```powershell
php artisan serve
```

Backend default URL: `http://127.0.0.1:8000`

## 2. Start Frontend

From `frontend/`:

```powershell
npm run dev
```

Frontend default URL: `http://127.0.0.1:5173`

## 3. Database (PostgreSQL)

Set in `backend/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=kino
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

Then run:

```powershell
php artisan config:clear
php artisan migrate
```

## 4. Common Commands

From `backend/`:

```powershell
php artisan test
```

From `frontend/`:

```powershell
npm run lint
npm run test
```
