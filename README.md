# Latif Landmark — Full Stack Connection Guide

Three separate projects work together as one system:

| Project | Folder | Port | Role |
|---|---|---|---|
| **Backend** | `landmark-backend/` | `5000` | Express + MongoDB REST API |
| **Frontend** | `landmark-frontend/` | `5173` | Public-facing React site |
| **Admin** | `landmark-admin/` | `5174` | Private React dashboard |

---

## How They Connect

```
Browser (Public)          Browser (Admin)
     │                         │
     ▼ :5173                   ▼ :5174
landmark-frontend         landmark-admin
     │                         │
     └──────────┬──────────────┘
                ▼ :5000
          landmark-backend  (Express)
                │
                ▼
            MongoDB
        latif_landmark DB
```

**Every API call** from both frontends goes to `http://localhost:5000/api`.

- **Public routes** (no auth): `/api/properties`, `/api/reviews`, `/api/stats`, `/api/inquiries`
- **Auth routes**: `/api/auth/login`, `/api/auth/me`, `/api/auth/change-password`
- **Admin routes** (JWT required): `/api/admin/dashboard`, `/api/admin/properties`, `/api/admin/inquiries`, `/api/admin/reviews`, `/api/admin/stats`

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on port 27017 — OR — a MongoDB Atlas URI

---

## Step 1 — Backend Setup

```bash
cd landmark-backend
npm install
```

The `.env` file is already created for you. Edit it if needed:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/latif_landmark
JWT_SECRET=change_this_to_a_long_random_secret_string
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@latiflandmark.com
ADMIN_PASSWORD=Admin@1234
CLIENT_URL=http://localhost:5173
```

> **Using MongoDB Atlas?** Replace `MONGO_URI` with your Atlas connection string.
> `MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/latif_landmark`

**Seed the database** (creates admin account + sample data):

```bash
npm run seed
```

Output confirms:
```
✅ Connected to MongoDB
👤 Admin created: admin@latiflandmark.com
🏠 Properties seeded.
⭐ Reviews seeded.
📊 Stats seeded.
✅ Database seeded successfully!
   Admin email    : admin@latiflandmark.com
   Admin password : Admin@1234
```

**Start the backend:**

```bash
npm run dev       # development (auto-restart with nodemon)
# or
npm start         # production
```

You should see:
```
🚀 Server running on http://localhost:5000 [development]
```

**Verify it's alive:**

```bash
curl http://localhost:5000/health
# {"status":"ok","env":"development","timestamp":"..."}
```

---

## Step 2 — Frontend Setup (Public Site)

```bash
cd landmark-frontend
npm install
```

The `.env.local` file is already created:

```
VITE_API_URL=http://localhost:5000/api
```

**Start the frontend:**

```bash
npm run dev
```

Opens at `http://localhost:5173`

The site will automatically load:
- Properties from `/api/properties`
- Reviews from `/api/reviews`
- Stats from `/api/stats`
- Contact form submits to `/api/inquiries`

---

## Step 3 — Admin Setup

```bash
cd landmark-admin
npm install
```

The `.env.local` file is already created:

```
VITE_API_URL=http://localhost:5000/api
```

**Start the admin:**

```bash
npm run dev
```

Opens at `http://localhost:5174`

**Login credentials** (seeded in Step 1):

```
Email:    admin@latiflandmark.com
Password: Admin@1234
```

---

## Running All Three Together

Open three terminal tabs:

```bash
# Terminal 1 — Backend
cd landmark-backend && npm run dev

# Terminal 2 — Frontend
cd landmark-frontend && npm run dev

# Terminal 3 — Admin
cd landmark-admin && npm run dev
```

---

## API Route Map

### Public (no authentication)

| Method | Route | Used by |
|---|---|---|
| GET | `/api/properties` | Frontend Properties section |
| GET | `/api/properties/:id` | Frontend property detail |
| GET | `/api/reviews` | Frontend Reviews section |
| GET | `/api/stats` | Frontend Stats section |
| POST | `/api/inquiries` | Frontend Contact form |

### Auth

| Method | Route | Used by |
|---|---|---|
| POST | `/api/auth/login` | Admin login page |
| GET | `/api/auth/me` | Admin — verify token on load |
| PUT | `/api/auth/change-password` | Admin settings |

### Admin (requires `Authorization: Bearer <token>`)

| Method | Route | Used by |
|---|---|---|
| GET | `/api/admin/dashboard` | Admin Dashboard page |
| POST | `/api/admin/properties` | Admin — add property |
| PUT | `/api/admin/properties/:id` | Admin — edit property |
| DELETE | `/api/admin/properties/:id` | Admin — delete property |
| GET | `/api/admin/inquiries` | Admin Inquiries page |
| GET | `/api/admin/inquiries/:id` | Admin inquiry detail |
| PUT | `/api/admin/inquiries/:id` | Admin — update inquiry status |
| DELETE | `/api/admin/inquiries/:id` | Admin — delete inquiry |
| GET | `/api/admin/reviews` | Admin Reviews page |
| POST | `/api/admin/reviews` | Admin — add review |
| PUT | `/api/admin/reviews/:id` | Admin — edit review |
| DELETE | `/api/admin/reviews/:id` | Admin — delete review |
| PUT | `/api/admin/stats` | Admin — update site stats |

---

## Token Storage

Both frontends store the JWT in `localStorage` under different keys to avoid collision:

| App | localStorage key |
|---|---|
| Frontend | `landmark_token` |
| Admin | `ll_admin_token` |

The admin `AuthContext` reads `ll_admin_token` on startup to restore session automatically.

---

## CORS

The backend allows:
- **Any `localhost` port** in `development` mode (covers both `:5173` and `:5174`)
- Only the exact `CLIENT_URL` value in `production`

No CORS changes are needed during local development.

---

## Production Deployment Notes

1. Set `NODE_ENV=production` in the backend `.env`
2. Set `CLIENT_URL` to your live frontend domain (e.g. `https://latiflandmark.com`)
3. Build both frontends: `npm run build` → deploy the `dist/` folder
4. Set `VITE_API_URL` to your live backend URL before building (e.g. `https://api.latiflandmark.com/api`)
5. Use a strong random `JWT_SECRET` — never reuse the development value

---

## Common Errors

| Symptom | Fix |
|---|---|
| `MongooseServerSelectionError` | MongoDB is not running. Start it: `mongod` |
| `CORS error` in browser | Backend is not running on port 5000, or wrong `VITE_API_URL` |
| `401 Invalid or expired token` | Log out and log in again in the admin panel |
| Properties/Reviews show empty | Run `npm run seed` in the backend |
| Admin login fails | Make sure seed ran successfully first |







admin panel:

http://localhost:5174


Email: admin@latiflandmark.com
Password: Admin@1234




Terminal 1 — Backend
  C:\projects\MY-WEBSITE-main\backend\landmark-backend
npm run dev

 


Terminal 2 — Frontend (the public website)

 C:\projects\MY-WEBSITE-main\frontend\landmark-frontend
npm run dev

 


Terminal 3 — Admin panel (only if you need it)

  C:\projects\MY-WEBSITE-main\admin\landmark-admin
npm run dev

 