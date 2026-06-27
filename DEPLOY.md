# Deployment Guide

This project has two parts that deploy separately:

| Part | Platform |
|------|----------|
| **Frontend** (Next.js) | Vercel |
| **Backend** (Django) | Railway (or Render / Fly.io) |
| **Database** (PostgreSQL) | Neon (recommended) or Railway Postgres |

> Vercel only runs Node.js — it cannot run Django. You must deploy the backend on a separate platform.

---

## Part 1 — Deploy the Database (Neon)

Neon is a free serverless PostgreSQL that works seamlessly with Vercel.

1. Go to [neon.tech](https://neon.tech) and sign up (free).
2. Create a new project → give it a name (e.g. `smart-todo`).
3. Copy the **Connection string**. It looks like:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Split the connection string into individual values — you will need them later:
   - `DB_HOST` = the part after `@` before the `/` (e.g. `ep-xxx.us-east-2.aws.neon.tech`)
   - `DB_NAME` = the database name at the end (e.g. `neondb`)
   - `DB_USER` = your username
   - `DB_PASSWORD` = your password
   - `DB_PORT` = `5432`

---

## Part 2 — Deploy the Backend (Railway)

Railway is the easiest platform for Django beginners — it detects Django automatically.

### Step 1 — Push your code to GitHub

Make sure your project is on GitHub. Railway deploys from a Git repository.

### Step 2 — Create a Railway project

1. Go to [railway.app](https://railway.app) and sign up with GitHub.
2. Click **New Project → Deploy from GitHub repo**.
3. Select your repository.
4. When asked for the **Root Directory**, set it to `backend`.
5. Railway will auto-detect Python. If it doesn't, add a `Procfile` (see below).

### Step 3 — Add a Procfile for Django

Create `backend/Procfile` (at the root of the `backend/` folder):

```
web: cd core && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT
```

Also add `gunicorn` to your requirements:

```
# backend/requirements.txt  — add this line
gunicorn>=21.2
```

### Step 4 — Set environment variables on Railway

In Railway → your project → **Variables**, add:

| Variable | Value |
|----------|-------|
| `SECRET_KEY` | A long random string (generate at [djecrety.ir](https://djecrety.ir)) |
| `DEBUG` | `False` |
| `DB_NAME` | Your Neon database name |
| `DB_USER` | Your Neon username |
| `DB_PASSWORD` | Your Neon password |
| `DB_HOST` | Your Neon host |
| `DB_PORT` | `5432` |
| `ALLOWED_HOSTS` | `your-backend.railway.app` (Railway gives you this URL after deploy) |
| `CORS_ALLOWED_ORIGINS` | `https://your-frontend.vercel.app` (Vercel gives you this URL) |

> You can update `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS` after the first deploy once you know the URLs.

### Step 5 — Update Django settings for production

In `backend/core/core/settings.py`, add your Railway and Vercel domains to the existing variables:

```python
# Replace the hardcoded lists with environment variables
import os

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "localhost").split(",")

CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS", "http://localhost:3000"
).split(",")
```

### Step 6 — Run Django migrations on Railway

After Railway deploys, open the **Railway shell** (or use the Railway CLI):

```bash
cd core
python manage.py migrate
```

Or add a **Release Command** in Railway settings:

```
cd core && python manage.py migrate
```

---

## Part 3 — Deploy the Frontend (Vercel)

### Step 1 — Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub.
2. Click **Add New → Project**.
3. Import your GitHub repository.

### Step 2 — Configure the build

In Vercel's project settings, set:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js (auto-detected) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` (default, leave as-is) |
| **Install Command** | `npm install` |

### Step 3 — Set environment variables on Vercel

In Vercel → your project → **Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.railway.app` |

> This tells your Next.js frontend where the Django API lives.

Then make sure your frontend API calls use this variable:

```ts
// services/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
```

### Step 4 — Deploy

Click **Deploy**. Vercel will build and publish your frontend. You will get a URL like `https://your-app.vercel.app`.

---

## Part 4 — Run the Seed File (English Learning Schedule)

After the backend is deployed and migrations are done, run the seed command to insert the 6-month English schedule.

### Option A — Railway shell (recommended)

1. In Railway → your project → open the **Shell** tab.
2. Run:
   ```bash
   cd core
   python manage.py seed_english_schedule --email your@email.com
   ```
   Replace `your@email.com` with the email of the user account you want to seed.

3. Optional — specify a custom start date:
   ```bash
   python manage.py seed_english_schedule --email your@email.com --start-date 2026-07-01
   ```

### Option B — Local machine (using production database)

Set your local environment to point to the Neon database, then run:

```powershell
# In backend/core/.env — temporarily point to Neon
$env:DB_HOST = "ep-xxx.us-east-2.aws.neon.tech"
$env:DB_NAME = "neondb"
# ... other vars

cd backend\core
python manage.py seed_english_schedule --email your@email.com
```

### What the seed creates

- 1 Category: **English**
- 3 Daily Habits (run for 26 weeks):
  - English Vocabulary
  - English Listening
  - English Reading
- 24 Weekly Tasks (one per week, Weeks 1–24):
  - BBC Vocabulary Practice → Final Full Mock Test

The command is safe to re-run — it uses `get_or_create` so it skips existing records.

---

## Part 5 — Custom Domain (Optional)

### On Vercel (frontend)

1. Go to your project → **Settings → Domains**.
2. Click **Add Domain** and type your domain (e.g. `app.yourdomain.com`).
3. Vercel will show you DNS records to add at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.).
4. Add the CNAME record, wait for DNS propagation (up to 48 hours, usually minutes).
5. Vercel will auto-provision an SSL certificate.

### On Railway (backend)

1. Go to your Railway service → **Settings → Networking → Custom Domain**.
2. Add your API domain (e.g. `api.yourdomain.com`).
3. Add the CNAME record at your registrar pointing to the Railway hostname.
4. Update `ALLOWED_HOSTS` in Railway variables to include `api.yourdomain.com`.
5. Update `NEXT_PUBLIC_API_URL` on Vercel to `https://api.yourdomain.com`.

---

## Common Errors and Fixes

### `DisallowedHost` — Django returns 400 Bad Request

**Cause**: Your deployed backend URL is not in `ALLOWED_HOSTS`.

**Fix**: In Railway Variables, add your Railway URL to `ALLOWED_HOSTS`:
```
ALLOWED_HOSTS=your-backend.railway.app
```
Redeploy after changing variables.

---

### CORS error in browser — `Access to fetch blocked by CORS policy`

**Cause**: `CORS_ALLOWED_ORIGINS` in Django does not include your Vercel URL.

**Fix**: In Railway Variables:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```
Make sure there is no trailing slash.

---

### `relation "tasks" does not exist` — Django can't find tables

**Cause**: Migrations have not been run on the production database.

**Fix**:
```bash
# In Railway shell
cd core
python manage.py migrate
```

---

### `ModuleNotFoundError: No module named 'gunicorn'`

**Cause**: gunicorn is not in `requirements.txt`.

**Fix**: Add `gunicorn>=21.2` to `backend/requirements.txt` and redeploy.

---

### `CommandError: No user found with email: ...` when running seed

**Cause**: The user account does not exist yet.

**Fix**: Create a superuser first, then run the seed:
```bash
cd core
python manage.py createsuperuser
python manage.py seed_english_schedule --email your@email.com
```

---

### Next.js build fails on Vercel — `Cannot find module`

**Cause**: Vercel does not know the root directory is `frontend/`.

**Fix**: In Vercel project settings → **Root Directory** → set to `frontend`. This is required because your repo root has both `backend/` and `frontend/`.

---

### Environment variables not picked up after change

Vercel and Railway both require a **redeploy** after you change environment variables. Trigger a redeploy manually from the dashboard or by pushing a new commit.
