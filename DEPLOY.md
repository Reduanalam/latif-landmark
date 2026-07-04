# Deployment Guide — Latif Landmark

This project has 3 parts that deploy separately:
- `backend/landmark-backend` → Railway
- `frontend/landmark-frontend` → Netlify
- `admin/landmark-admin` → Netlify (separate site)

## Why plots weren't showing

The frontend calls your backend at the URL in `VITE_API_URL`. If that variable
isn't set at build time, it silently falls back to `http://localhost:5000/api`,
which cannot be reached from a visitor's browser — so the plot map loads empty
with no visible error. This project now shows a clear error message on screen
and logs details to the browser console instead of failing silently, so if
this happens again you'll immediately see why.

## 1. Deploy the backend (Railway)

1. Push this repo to GitHub, create a new Railway project from it, set the
   **root directory** to `backend/landmark-backend`.
2. In Railway → your service → **Variables**, add:
   ```
   PORT=5000
   NODE_ENV=production
   MONGO_URI=<your MongoDB Atlas connection string>
   JWT_SECRET=<a long random string>
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=admin@latiflandmark.com
   ADMIN_PASSWORD=<a real password>
   CLIENT_URL=https://your-frontend.netlify.app,https://your-admin.netlify.app
   ```
   `CLIENT_URL` must exactly match the Netlify URLs you deploy in step 2 —
   comma-separated if you have both the frontend and admin panel. No trailing
   slash.
3. In Railway → **Settings → Networking**, click **Generate Domain** if you
   don't already have one. Copy that URL (e.g. `https://xxxx.up.railway.app`).
4. Verify it's alive by visiting `https://xxxx.up.railway.app/health` in your
   browser — you should see `{"status":"ok",...}`.
5. Seed the database once (from your local machine, with `.env` pointing at
   the same `MONGO_URI`):
   ```
   cd backend/landmark-backend
   npm install
   npm run seed
   ```

## 2. Deploy the frontend (Netlify)

1. New site from Git, **base directory** `frontend/landmark-frontend`,
   build command `npm run build`, publish directory `dist` (already set in
   `netlify.toml`).
2. In Netlify → **Site configuration → Environment variables**, add:
   ```
   VITE_API_URL=https://xxxx.up.railway.app/api
   ```
   (use the real Railway URL from step 1.3, keep the trailing `/api`)
3. Trigger a deploy (env vars only apply to builds that run after they're
   set — redeploy if you added it after the first build).
4. Once live, open the site, open DevTools Console — if `VITE_API_URL` is
   still missing you'll see a red `[Landmark]` warning telling you exactly
   what to fix.

## 3. Deploy the admin panel (Netlify)

Same as step 2 but base directory `admin/landmark-admin`, and its own
`VITE_API_URL` pointing at the same Railway backend.

## Quick checklist if plots/properties don't show again

- [ ] Backend `/health` responds
- [ ] Netlify env var `VITE_API_URL` is set and points at the Railway `/api` URL (not localhost)
- [ ] Railway `CLIENT_URL` includes your exact Netlify domain(s)
- [ ] Database was seeded (`npm run seed` in backend)
- [ ] Browser console on the live site has no red `[Landmark]` or `[CORS]` errors
