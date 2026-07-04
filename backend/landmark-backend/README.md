# Latif Landmark – Backend API

Node.js + Express + MongoDB REST API for the Latif Landmark Ltd. real estate website.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
cd latif-landmark-backend
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
```

### 3. Seed the database
```bash
npm run seed
```
This creates the admin account, all properties, reviews, and stats.

### 4. Start the server
```bash
npm run dev      # development (nodemon)
npm start        # production
```

Server runs on **http://localhost:5000** by default.

---

## ⚙️ Environment Variables

| Variable          | Description                          | Default                        |
|-------------------|--------------------------------------|--------------------------------|
| `PORT`            | Server port                          | `5000`                         |
| `NODE_ENV`        | `development` or `production`        | `development`                  |
| `MONGO_URI`       | MongoDB connection string            | `mongodb://localhost:27017/latif_landmark` |
| `JWT_SECRET`      | Secret key for signing JWTs          | *(must set)*                   |
| `JWT_EXPIRES_IN`  | JWT expiry duration                  | `7d`                           |
| `ADMIN_EMAIL`     | Seed admin email                     | `admin@latiflandmark.com`      |
| `ADMIN_PASSWORD`  | Seed admin password                  | `Admin@1234`                   |
| `CLIENT_URL`      | Frontend URL (CORS whitelist)        | `http://localhost:5173`        |

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

All protected routes require:
```
Authorization: Bearer <token>
```

---

### 🔐 Auth

| Method | Endpoint                  | Auth     | Description              |
|--------|---------------------------|----------|--------------------------|
| POST   | `/auth/login`             | Public   | Admin login              |
| GET    | `/auth/me`                | Admin    | Get current admin info   |
| PUT    | `/auth/change-password`   | Admin    | Change admin password    |

**Login request body:**
```json
{ "email": "admin@latiflandmark.com", "password": "Admin@1234" }
```
**Login response:**
```json
{
  "success": true,
  "token": "eyJ...",
  "admin": { "id": "...", "name": "Latif Admin", "email": "...", "role": "superadmin" }
}
```

---

### 🏠 Properties (Public)

| Method | Endpoint               | Description                          |
|--------|------------------------|--------------------------------------|
| GET    | `/properties`          | List all properties                  |
| GET    | `/properties?status=Available` | Filter by status (Available / Sold / Reserved) |
| GET    | `/properties/:id`      | Get single property                  |

**Property object:**
```json
{
  "_id": "...",
  "title": "Duplex Province – Block A",
  "location": "Noikahon, Araihazar, Narayanganj",
  "status": "Available",
  "description": "...",
  "images": ["https://..."],
  "featured": true,
  "order": 1
}
```

---

### 📩 Inquiries (Public – Contact Form)

| Method | Endpoint       | Description              |
|--------|----------------|--------------------------|
| POST   | `/inquiries`   | Submit a contact inquiry |

**Request body:**
```json
{
  "name": "John Doe",
  "phone": "01XXXXXXXXX",
  "email": "john@example.com",
  "plot": "Noikahon, Araihazar, Narayanganj",
  "message": "I'm interested in a plot."
}
```

---

### ⭐ Reviews (Public)

| Method | Endpoint    | Description             |
|--------|-------------|-------------------------|
| GET    | `/reviews`  | List all visible reviews |

---

### 📊 Stats (Public)

| Method | Endpoint  | Description       |
|--------|-----------|-------------------|
| GET    | `/stats`  | Get site statistics |

---

### 🔒 Admin Routes (All require Bearer token)

#### Dashboard
| Method | Endpoint            | Description                    |
|--------|---------------------|--------------------------------|
| GET    | `/admin/dashboard`  | Overview counts + recent inquiries |

#### Properties Management
| Method | Endpoint                   | Description       |
|--------|----------------------------|-------------------|
| POST   | `/admin/properties`        | Create property   |
| PUT    | `/admin/properties/:id`    | Update property   |
| DELETE | `/admin/properties/:id`    | Delete property   |

#### Inquiries Management
| Method | Endpoint                   | Description                        |
|--------|----------------------------|------------------------------------|
| GET    | `/admin/inquiries`         | List all inquiries (paginated)     |
| GET    | `/admin/inquiries?status=new` | Filter by status (new/contacted/closed) |
| GET    | `/admin/inquiries/:id`     | Get single inquiry                 |
| PUT    | `/admin/inquiries/:id`     | Update status / add notes          |
| DELETE | `/admin/inquiries/:id`     | Delete inquiry                     |

#### Reviews Management
| Method | Endpoint                | Description           |
|--------|-------------------------|-----------------------|
| GET    | `/admin/reviews`        | List all reviews      |
| POST   | `/admin/reviews`        | Create review         |
| PUT    | `/admin/reviews/:id`    | Update / hide review  |
| DELETE | `/admin/reviews/:id`    | Delete review         |

#### Stats Management
| Method | Endpoint        | Description     |
|--------|-----------------|-----------------|
| PUT    | `/admin/stats`  | Update stats    |

---

## 🔗 Connecting the Frontend

### 1. Install axios in the React project
```bash
npm install axios
```

### 2. Create `src/api/index.js`
```js
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('landmark_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### 3. Replace hardcoded data with API calls

**Properties.jsx** – fetch from API instead of importing from `data/properties.js`:
```jsx
import { useEffect, useState } from 'react';
import api from '../api';

export default function Properties() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get('/properties').then(res => setProperties(res.data.data));
  }, []);
  // ... rest of component
}
```

**Contact.jsx** – submit form to API:
```jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  await api.post('/inquiries', form);
  setSubmitted(true);
};
```

**Stats.jsx** – fetch stats:
```jsx
useEffect(() => {
  api.get('/stats').then(res => setStats(res.data.data));
}, []);
```

**Reviews.jsx** – fetch reviews:
```jsx
useEffect(() => {
  api.get('/reviews').then(res => setReviews(res.data.data));
}, []);
```

---

## 📁 Project Structure

```
latif-landmark-backend/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Login, me, change-password
│   │   ├── dashboardController.js
│   │   ├── inquiryController.js
│   │   ├── propertyController.js
│   │   ├── reviewController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect middleware
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Inquiry.js
│   │   ├── Property.js
│   │   ├── Review.js
│   │   └── Stats.js
│   ├── routes/
│   │   ├── admin.js            # All protected /admin/* routes
│   │   ├── auth.js             # /auth/* routes
│   │   └── public.js           # Public read routes
│   └── server.js               # Express app entry point
├── scripts/
│   └── seed.js                 # DB seeder
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🛡️ Security Features

- **Helmet** – sets secure HTTP headers
- **Rate limiting** – 20 req/15min on auth, 200 req/15min on API
- **JWT authentication** – all admin routes protected
- **bcrypt** – passwords hashed with salt rounds of 12
- **CORS** – restricted to your frontend URL
- **Input validation** – required fields enforced in controllers & Mongoose schemas
