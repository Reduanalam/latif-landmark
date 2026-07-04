# 🚀 Latif Landmark — Deployment Guide

Deploy order: MongoDB Atlas → Railway (Backend) → Netlify (Frontend) → Netlify (Admin)

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

---

## STEP 2 — Railway (Backend)

1. Go to https://railway.app → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo**
   - OR: **New Project** → **Empty Project** → drag & drop the `backend/landmark-backend` folder
3. Set **Root Directory** to: `backend/landmark-backend`
4. Go to **Variables** tab → add these:

   | Key | Value |
   |-----|-------|
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | your MongoDB Atlas URI from Step 1 |
   | `JWT_SECRET` | any long random string (e.g. `latif_super_secret_2025_xyz`) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `ADMIN_EMAIL` | `admin@latiflandmark.com` |
   | `ADMIN_PASSWORD` | `Admin@1234` |
   | `CLIENT_URL` | `https://your-frontend.netlify.app,https://your-admin.netlify.app` |

5. Deploy → wait for it to go live
6. Copy your Railway URL: `https://latif-backend.up.railway.app`

### Seed the database (add plots + admin user):
After Railway deploys, go to Railway → your project → **New Service** → **Run command**:
```
npm run seed
```
OR in your local terminal:
```bash
cd backend/landmark-backend
# Edit .env with your MONGO_URI first
npm run seed
```

---

## STEP 3 — Netlify (Frontend / Main Website)

1. Go to https://netlify.com → Sign up (free)
2. **Add new site** → **Deploy manually**
3. First, build locally:
   ```bash
   cd frontend/landmark-frontend
   # Create .env file:
   echo "VITE_API_URL=https://your-backend.up.railway.app/api" > .env
   npm install
   npm run build
   ```
4. Drag & drop the `frontend/landmark-frontend/dist` folder to Netlify
5. Go to **Site Settings** → **Environment Variables** → add:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   ```
6. Copy your Netlify URL: `https://latif-landmark.netlify.app`

---

## STEP 4 — Netlify (Admin Panel)

1. In Netlify → **Add new site** → **Deploy manually**
2. Build locally:
   ```bash
   cd admin/landmark-admin
   echo "VITE_API_URL=https://your-backend.up.railway.app/api" > .env
   npm install
   npm run build
   ```
3. Drag & drop the `admin/landmark-admin/dist` folder to Netlify
4. Add Environment Variable:
   ```
   VITE_API_URL = https://your-backend.up.railway.app/api
   ```
5. Copy your admin URL: `https://latif-admin.netlify.app`

---

## STEP 5 — Update CORS on Railway

After both Netlify sites are live, go to Railway → Variables → update:
```
CLIENT_URL = https://latif-landmark.netlify.app,https://latif-admin.netlify.app
```
Then redeploy.

---

## ✅ Final URLs

| Service | URL |
|---------|-----|
| Main Website | https://latif-landmark.netlify.app |
| Admin Panel | https://latif-admin.netlify.app |
| Backend API | https://latif-backend.up.railway.app |

---

## Admin Login

```
Email:    admin@latiflandmark.com
Password: Admin@1234
```
