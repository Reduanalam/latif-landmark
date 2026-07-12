# 🚀 Latif Landmark — Deployment Guide

Deploy order: MongoDB Atlas → Render (Backend) → Netlify (Frontend) → Netlify (Admin)

---

## STEP 1 — MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/atlas → Sign up (free)
2. Create a free **M0 cluster**
3. **Database Access** → Add user → set username & password
4. **Network Access** → Add IP → click "Allow Access from Anywhere" (0.0.0.0/0)
5. **Connect** → Drivers → copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/latif_landmark
   ```
6. Save this URI — you'll need it in Step 2
7. If your cluster ever shows "paused due to inactivity," open Atlas and
   click **Resume** — free clusters pause after prolonged idle time.

---

## STEP 2 — Render (Backend)

1. Go to https://render.com → Sign up with GitHub
2. **New +** → **Web Service** → select this GitHub repo
3. Fill in:

   | Field | Value |
   |-------|-------|
   | Name | `latif-landmark-backend` |
   | Region | Singapore (or nearest) |
   | Branch | `main` |
   | Root Directory | `backend/landmark-backend` |
   | Runtime | Node |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | Free |

4. Scroll to **Environment Variables** → add these **one at a time** (adding
   several at once by pasting multiple lines into a single field can corrupt
   the values — add one, confirm it saved, then add the next):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | your MongoDB Atlas URI from Step 1 |
   | `JWT_SECRET` | any long random string (e.g. `latif_super_secret_2025_xyz`) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `ADMIN_EMAIL` | `admin@latiflandmark.com` |
   | `ADMIN_PASSWORD` | `Admin@1234` |
   | `CLIENT_URL` | `https://your-frontend.netlify.app,https://your-admin.netlify.app` |

   (Don't set `PORT` — Render assigns it automatically.)

5. Click **Create Web Service** → wait for it to build and go live
6. Copy your Render URL, e.g. `https://latif-landmark.onrender.com`
7. Test it: visit `https://latif-landmark.onrender.com/health` — should show
   `{"status":"ok",...}`.
   > Free instances sleep after 15 minutes of no traffic — the first request
   > after idle time can take 30-60 seconds. This is normal, not an error.

### Seed the database (add plots + admin user):

From your local machine (uses your local `.env`, which points at the same
`MONGO_URI` as Render):
```bash
cd backend/landmark-backend
npm install
npm run seed
```

---

## STEP 3 — Netlify (Frontend / Main Website)

1. Go to https://netlify.com → Sign up (free)
2. **Add new site** → **Import an existing project** → GitHub → select this repo
3. Settings:
   ```
   Base directory: frontend/landmark-frontend
   Build command: npm run build
   Publish directory: frontend/landmark-frontend/dist
   ```
4. Before deploying, add environment variable:
   ```
   VITE_API_URL = https://latif-landmark.onrender.com/api
   ```
5. Deploy. Copy your Netlify URL, e.g. `https://latif-landmark.netlify.app`

---

## STEP 4 — Netlify (Admin Panel)

1. **Add new site** → **Import an existing project** → same GitHub repo
2. Settings:
   ```
   Base directory: admin/landmark-admin
   Build command: npm run build
   Publish directory: admin/landmark-admin/dist
   ```
3. Add environment variable:
   ```
   VITE_API_URL = https://latif-landmark.onrender.com/api
   ```
4. Deploy. Copy your admin URL, e.g. `https://latif-landmark-admin.netlify.app`

---

## STEP 5 — Update CORS on Render

After both Netlify sites are live, go to Render → your service → **Environment** →
update `CLIENT_URL`:
```
CLIENT_URL = https://latif-landmark.netlify.app,https://latif-landmark-admin.netlify.app
```
Save — Render auto-redeploys.

---

## ✅ Final URLs (this project's actual live deployment)

| Service | URL |
|---------|-----|
| Main Website | https://latif-landmark.netlify.app |
| Admin Panel | https://latif-landmark.netlify.app/admin (redirects to admin site) |
| Backend API | https://latif-landmark.onrender.com |

---

## Admin Login

```
Email:    admin@latiflandmark.com
Password: Admin@1234
```
⚠️ Change this password in Render's environment variables once everything is
confirmed working.