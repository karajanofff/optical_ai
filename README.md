# Optical AI Monitoring

AI-powered optical network monitoring platform for tracking fiber devices, simulating live telemetry, detecting anomalies, and predicting possible failures through a FastAPI and React stack.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, Recharts
- Backend: FastAPI, SQLAlchemy, JWT, WebSocket
- Database: PostgreSQL
- AI/ML: scikit-learn, pandas, numpy
- DevOps: Docker, Docker Compose

## Features

- JWT authentication with `admin` and `operator` roles
- Premium dashboard with live KPI cards and visual analytics
- Device CRUD management
- Device detail view with AI prediction and metric history
- Real-time monitoring with WebSocket updates
- AI-based classification: `normal`, `warning`, `critical`
- Auto-created alerts from anomalies
- Daily and weekly report summary endpoint
- Seeded demo data and automatic model training on startup

## Project Structure

```text
optical-ai-monitoring/
├── .env.example
├── docker-compose.yml
├── README.md
├── backend/
│   ├── .env.example
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── ai/
│       ├── api/
│       ├── core/
│       ├── db/
│       ├── models/
│       ├── schemas/
│       ├── services/
│       └── utils/
└── frontend/
    ├── .env.example
    ├── Dockerfile
    ├── index.html
    ├── nginx.conf
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── components/
        ├── context/
        ├── hooks/
        ├── index.css
        ├── layout/
        ├── main.tsx
        ├── pages/
        ├── services/
        ├── types/
        └── utils/
```

## Default Credentials

- `admin` / `admin123`
- `operator` / `operator123`

## Run With Docker

1. Copy `.env.example` to `.env`.
2. Run:

```bash
docker compose up --build
```

3. Open:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## Local Development

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Set `DATABASE_URL` to your local PostgreSQL instance, for example:

```bash
postgresql://postgres:postgres@localhost:5432/optical_ai_monitoring
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Overview

- `POST /api/auth/login`
- `GET /api/devices`
- `POST /api/devices`
- `GET /api/devices/{id}`
- `PUT /api/devices/{id}`
- `DELETE /api/devices/{id}`
- `GET /api/devices/{id}/metrics`
- `GET /api/alerts`
- `PATCH /api/alerts/{id}`
- `GET /api/metrics/live`
- `WS /api/metrics/ws/live`
- `POST /api/ai/predict`
- `GET /api/reports/summary`

## Deploy to Render (GitHub)

Loyiha `render.yaml` Blueprint orqali frontend, backend va PostgreSQL ni birga deploy qiladi.

### 1. GitHub ga yuklash

```bash
git add .
git commit -m "Add Render deployment"
git push origin main
```

### 2. Render da Blueprint yaratish

1. [render.com](https://render.com) da akkaunt oching va GitHub ni ulang.
2. **New +** → **Blueprint**.
3. `optical_ai` reponi tanlang.
4. `render.yaml` dagi servislar ko'rinadi:
   - `optical-ai-db` — PostgreSQL
   - `optical-ai-api` — FastAPI backend (Docker)
   - `optical-ai-web` — React frontend (static)
5. **Apply** bosing va deploy tugashini kuting (birinchi marta 5–10 daqiqa).

### 3. Tayyor URL lar

| Servis   | URL namunasi                              |
|----------|-------------------------------------------|
| Frontend | `https://optical-ai-web.onrender.com`     |
| Backend  | `https://optical-ai-api.onrender.com`     |
| API docs | `https://optical-ai-api.onrender.com/docs`|

`render.yaml` frontend va backend URL larini avtomatik bog'laydi (`CORS`, `VITE_API_URL`, WebSocket).

### 4. Muhim eslatmalar

- **Free tier**: servislar 15 daqiqa faolsizlikdan keyin uxlaydi; birinchi so'rov sekin bo'lishi mumkin.
- **PostgreSQL free**: 90 kundan keyin muddati tugaydi; production uchun paid plan tavsiya etiladi.
- **SECRET_KEY** Render tomonidan avtomatik yaratiladi; qo'lda o'zgartirish shart emas.
- GitHub ga push qilganda servislar avtomatik qayta deploy bo'ladi (`autoDeploy: true`).

### 5. Qo'lda tekshirish

```bash
curl https://optical-ai-api.onrender.com/health
# {"status":"ok"}
```

Login: `admin` / `admin123`

## Notes

- The backend trains and stores the AI model automatically at startup in `app/ai/model.joblib`.
- The application seeds users, devices, alerts, and metrics automatically when the database is empty.
- WebSocket live monitoring uses mock data generation when real optical hardware integration is unavailable.
