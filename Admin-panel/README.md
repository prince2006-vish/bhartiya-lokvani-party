# Bharati Lok Vani Admin Panel

React + Express + MongoDB admin panel based on the supplied design.

## Requirements
- Node.js 18+
- MongoDB Atlas connection string

## 1. Backend
```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/bharati_lok_vani?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

Run:
```bash
npm run dev
```

## 2. Frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```

Open the URL shown by Vite, normally:
`http://localhost:5173`

Login:
- Email: value of `ADMIN_EMAIL`
- Password: value of `ADMIN_PASSWORD`

## MongoDB
The app creates the collections automatically when you add data:
- news
- events
- members
- galleries

The dashboard counts come from MongoDB.

## API
- POST `/api/auth/login`
- GET `/api/dashboard/stats`
- GET/POST/PUT/DELETE `/api/news`
- GET/POST/PUT/DELETE `/api/events`
- GET/POST/PUT/DELETE `/api/members`
- GET/POST/PUT/DELETE `/api/gallery`
