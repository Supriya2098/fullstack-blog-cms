<<<<<<< HEAD
# Blog CMS — Full Stack Development (Week 3 & 4)

A full-stack blog and content management system built for the internship task. Users can register, log in, create posts, and comment on articles.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, React Router      |
| Backend  | Node.js, Express 5                  |
| Database | SQLite (Prisma ORM)                 |
| Auth     | JWT (JSON Web Tokens) + bcrypt      |

## Project Structure

```
├── backend/          # Express API + Prisma
├── frontend/         # React SPA
├── docs/             # Database schema diagram
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- npm (comes with Node.js)

## Local Setup

### 1. Clone and open the project

```bash
git clone <your-github-repo-url>
cd blog-cms
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Backend runs at **http://localhost:5000**

### 3. Frontend setup (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

## Demo Accounts

After running the seed script:

| Email              | Password     |
|--------------------|--------------|
| alice@example.com  | password123  |
| bob@example.com    | password123  |

## Features Checklist

### Week 3
- [x] Database design (users, posts, comments)
- [x] Database schema diagram (`docs/DATABASE_SCHEMA.md`)
- [x] Signup / login API endpoints
- [x] Frontend login & signup pages
- [x] Navigation (Home, Posts, Login, Sign Up)

### Week 4
- [x] Post CRUD API endpoints
- [x] Comment API endpoints
- [x] Post list page
- [x] Single post page with comments
- [x] Create / edit / delete posts (author only)
- [x] Frontend connected to backend APIs

## Deployment

### Backend (Render / Railway)

1. Push `backend/` to your repo.
2. Create a new Web Service.
3. Set environment variables:
   - `DATABASE_URL` — use PostgreSQL URL for production (update `schema.prisma` provider to `postgresql`)
   - `JWT_SECRET` — long random string
   - `FRONTEND_URL` — your deployed frontend URL
   - `PORT` — `5000`
4. Build command: `npm install && npx prisma migrate deploy`
5. Start command: `npm start`

### Frontend (Vercel / Netlify)

1. Root directory: `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variable:
   - `VITE_API_URL` — `https://your-backend-url.com/api`

## API Testing (optional)

```bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"secret12\"}"

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"alice@example.com\",\"password\":\"password123\"}"
```

## Submission Checklist

- [ ] GitHub repository with all code pushed
- [ ] README with setup instructions (this file)
- [ ] Database schema diagram in `docs/DATABASE_SCHEMA.md`
- [ ] Live backend URL added to submission
- [ ] Live frontend URL added to submission
- [ ] Demo: signup → create post → add comment

## Author

Your Name — Internship Full Stack Development Task
=======
# fullstack-blog-cms
>>>>>>> b0ed1217f471847b377b942c613d4f02329dcb46
