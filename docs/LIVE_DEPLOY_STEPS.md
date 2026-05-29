# Get Live URLs (Step-by-Step)

Repo: https://github.com/Supriya2098/fullstack-blog-cms

---

## Part 1 — Backend on Render (~10 min)

1. Open **https://dashboard.render.com** → Sign up with GitHub.
2. Click **Blueprints** → **New Blueprint Instance**.
3. Connect repo **Supriya2098/fullstack-blog-cms**.
4. Render reads `render.yaml` and creates:
   - PostgreSQL database
   - Web service `fullstack-blog-api`
5. When asked for **FRONTEND_URL**, enter: `https://placeholder.vercel.app` (update after Part 2).
6. Wait until deploy status is **Live**.
7. Copy your backend URL, e.g.  
   **`https://fullstack-blog-api.onrender.com`**
8. Test: open `https://YOUR-BACKEND.onrender.com/api/health` — should show `"status":"ok"`.

---

## Part 2 — Frontend on Vercel (~5 min)

1. Open **https://vercel.com** → Sign up with GitHub.
2. **Add New Project** → Import **fullstack-blog-cms**.
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework:** Vite
4. **Environment Variables:**

   | Name | Value |
   |------|--------|
   | `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com/api` |

   Replace `YOUR-BACKEND` with your real Render hostname.

5. Click **Deploy**.
6. Copy your frontend URL, e.g.  
   **`https://fullstack-blog-cms.vercel.app`**

---

## Part 3 — Connect frontend ↔ backend

1. Go back to **Render** → your web service → **Environment**.
2. Set **FRONTEND_URL** = your Vercel URL (e.g. `https://fullstack-blog-cms.vercel.app`).
3. **Save** → Render redeploys automatically.

---

## Part 4 — Test live app

1. Open your **Vercel URL**.
2. Sign up or login (team accounts from seed).
3. Browse articles → create post → add comment.

---

## Submit to internship

| Item | Example |
|------|---------|
| GitHub | https://github.com/Supriya2098/fullstack-blog-cms |
| Live frontend | https://your-app.vercel.app |
| Live backend | https://fullstack-blog-api.onrender.com/api/health |

---

## Optional — Deploy frontend via terminal

```powershell
cd "D:\WEBTHISM WEEK 3,4 TASK\frontend"
npx vercel login
npx vercel --prod
```

Set `VITE_API_URL` in the Vercel dashboard when prompted or after deploy.
