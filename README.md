# Latif Landmark Ltd. — Plot Booking Platform

A full-stack real estate plot booking platform for **Latif Landmark Ltd.**, featuring a public marketing website, an interactive plot booking system, and an admin dashboard for managing properties, bookings, reviews, and inquiries.

🔗 **Live site:** https://latif-landmark.netlify.app
🔗 **Admin panel:** https://latif-landmark.netlify.app/admin

---

## ✨ Features

- Property listings with details and images
- Interactive plot booking map (348 plots across Blocks A, B, C)
- Customer reviews section
- Contact / inquiry form
- Admin dashboard:
  - Manage properties
  - Approve/reject plot bookings
  - View and respond to inquiries
  - Manage reviews
  - Role-based authentication (JWT)

---

## 🛠 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React (Vite), CSS |
| Admin Panel | React (Vite) |
| Backend   | Node.js, Express |
| Database  | MongoDB (Atlas) with Mongoose |
| Auth      | JWT |
| Hosting   | Netlify (frontend + admin), Railway (backend) |

---

## 📁 Project Structure

```
MY-WEBSITE-main/
├── frontend/landmark-frontend/   # Public website (React + Vite)
├── admin/landmark-admin/         # Admin dashboard (React + Vite)
├── backend/landmark-backend/     # REST API (Node/Express/MongoDB)
└── DEPLOY.md                     # Full deployment guide
```

---

## 🚀 Running Locally

Each part runs independently — open 3 terminals.

### 1. Backend
```bash
cd backend/landmark-backend
npm install
cp .env.example .env   # fill in your MongoDB URI, JWT secret, etc.
npm run seed            # one-time: seeds admin user, properties, plots
npm run dev
```
Runs on `http://localhost:5000`

### 2. Frontend (public site)
```bash
cd frontend/landmark-frontend
npm install
cp .env.example .env    # set VITE_API_URL=http://localhost:5000/api
npm run dev
```
Runs on `http://localhost:5173`

### 3. Admin panel
```bash
cd admin/landmark-admin
npm install
cp .env.example .env    # set VITE_API_URL=http://localhost:5000/api
npm run dev
```
Runs on `http://localhost:5174`

**Default admin login** (change after first deploy — see `DEPLOY.md`):
```
Email: admin@latiflandmark.com
Password: Admin@1234
```

---

## 🌐 Deployment

See [`DEPLOY.md`](./DEPLOY.md) for the full step-by-step guide to deploying:
- Backend → Railway
- Frontend + Admin → Netlify

---

## 🔐 Environment Variables

**Backend** (`backend/landmark-backend/.env`):
```
PORT=5000
NODE_ENV=production
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=
ADMIN_PASSWORD=
CLIENT_URL=            # comma-separated frontend + admin URLs
```

**Frontend / Admin** (`.env`):
```
VITE_API_URL=          # backend API URL, e.g. https://your-backend.up.railway.app/api
```

> ⚠️ Never commit `.env` files or `node_modules` — both are excluded via `.gitignore`.

---

## 📍 Company Info

**Latif Landmark Ltd.**
Plot locations: Noikahon, Araihazar, Narayanganj · Bashundhara R/A, Dhaka
Office: 1/1/D/1 North Jatrabari, Bibir Bagicha, Dhaka