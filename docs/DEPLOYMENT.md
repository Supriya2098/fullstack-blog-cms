# Deployment Guide (Week 4 Deliverable)

Follow these steps to get **live frontend and backend URLs** for your submission.

## Option A: Render (Backend) + Vercel (Frontend) — Recommended & Free

### Backend on Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your repo; set **Root Directory** to `backend`.
4. Environment variables:

   | Key           | Value                                      |
   |---------------|--------------------------------------------|
   | `DATABASE_URL`| PostgreSQL URL from Render Postgres (free) |
   | `JWT_SECRET`  | Long random string (32+ chars)             |
   | `FRONTEND_URL`| `https://your-app.vercel.app`              |
   | `PORT`        | `5000`                                     |

5. For PostgreSQL, change `backend/prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

6. Build: `npm install && npx prisma migrate deploy`
7. Start: `npm start`
8. Copy your Render URL, e.g. `https://blog-cms-api.onrender.com`

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**.
2. Import your GitHub repo; set **Root Directory** to `frontend`.
3. Environment variable:

   | Key             | Value                                      |
   |-----------------|--------------------------------------------|
   | `VITE_API_URL`  | `https://blog-cms-api.onrender.com/api`    |

4. Deploy. Copy your Vercel URL, e.g. `https://blog-cms.vercel.app`

5. Update Render `FRONTEND_URL` to your Vercel URL and redeploy if needed.

---

## Option B: Run locally for demo (if deploy is delayed)

1. Install [Node.js 18+](https://nodejs.org/).
2. Backend: `cd backend` → `npm install` → `npx prisma migrate dev` → `npm run db:seed` → `npm run dev`
3. Frontend: `cd frontend` → `npm install` → `npm run dev`
4. Open http://localhost:5173 and record a short screen recording for submission.

---

## Post-deploy smoke test

1. Open frontend URL → Home page loads.
2. Sign up with a new account.
3. Create a post → appears on Posts list.
4. Open post → add a comment.
5. Log out and log back in.

## What to submit to internship

| Item                    | Where to put it                          |
|-------------------------|------------------------------------------|
| GitHub repo link        | Submission form                          |
| Database schema         | `docs/DATABASE_SCHEMA.md`              |
| Live backend URL        | Render/Railway URL                       |
| Live frontend URL       | Vercel/Netlify URL                       |
| README                  | Root `README.md`                         |
