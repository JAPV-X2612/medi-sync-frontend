# MediSync — Frontend

> Patient-facing web application for the MediSync medical appointment management system.  
> Built with React 18, Vite, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| State management | Redux Toolkit |
| HTTP client | Fetch API (`src/services/api.js`) |
| Testing | Vitest 2 + Testing Library |
| Coverage | @vitest/coverage-v8 |
| CI/CD | GitHub Actions → Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── booking/        # Booking-flow components (calendar, time slots, panel)
│   ├── cards/          # Display cards (AppointmentCard, SpecialistCard)
│   ├── layout/         # Page shell (NavigationSidebar, PageHeader, PageContainer)
│   └── ui/             # Stateless primitives (Button, Badge, Icon, Spinner)
├── hooks/
│   ├── useApi.js       # Data-fetching hooks (useAppointments, useSpecialists, …)
│   └── useAuth.js      # Email-based authentication backed by localStorage
├── pages/
│   ├── Dashboard.jsx       # Appointment list for the logged-in patient
│   ├── FindSpecialist.jsx  # Doctor search and selection
│   ├── TimeSlots.jsx       # Weekly calendar + available slot picker
│   ├── Confirmation.jsx    # Booking summary screen
│   └── Login.jsx           # Email login gate
├── services/
│   └── api.js          # All HTTP calls to the API Gateway — single entry point
├── utils/
│   └── time.js         # Date helpers, slot grid builder, card shape mapper
└── data/
    └── mockData.js     # Static fallback data for local development
```

---

## Getting Started

### Prerequisites

- Node.js 20 LTS
- Backend running locally via Docker ([medi-sync-backend](https://github.com/JAPV-X2612/medi-sync-backend))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/JAPV-X2612/medi-sync-frontend.git
cd medi-sync-frontend

# 2. Switch to the integration branch
git checkout feat/connect-real-backend

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env
```

`.env.example`:
```
VITE_API_BASE_URL=http://localhost:3000
```

### Seed the database

Make sure the backend is running, then:

```bash
npm run seed
```

This creates one patient, three specialties, three doctors, and Mon–Fri schedules — all idempotent (safe to run multiple times).

### Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and log in with `seed@medisync.local`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run seed` | Seed backend with demo data via HTTP |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:cov` | Run tests with coverage report |

---

## Authentication

Login is intentionally simple — no JWT or sessions.  
Enter a patient email → the app fetches `GET /patients`, finds the match, and stores the raw patient record in `localStorage`. Logout clears the entry.

**Demo credential:** `seed@medisync.local`

---

## How the API Layer Works

All contract adaptation between the frontend shape and the backend shape lives in `src/services/api.js` — components never call `fetch` directly.

Key mappings:

| Frontend needs | Backend provides | Adapter strategy |
|---|---|---|
| `GET /specialists` | `GET /doctors` + `GET /specialties` | Parallel fetch, join by `specialtyId` in JS |
| Available slots `{morning, afternoon}` | `GET /doctors/:id/schedules` + `GET /appointments` | Build 30-min grid, subtract booked times |
| `POST /appointments` | Expects full patient + doctor data | Enriched from localStorage + doctor fetch |
| `PATCH /appointments/:id/cancel` | `PATCH /appointments/:id/cancel` | Direct proxy |

---

## CI/CD Pipeline

Every pull request merged into `main` triggers three sequential stages:

```
PR merged to main
    │
    ▼
build-and-test ── npm ci → vite build → vitest --coverage
    │
    ▼
sonarcloud ── static analysis + coverage upload
    │
    ▼
deploy ── Vercel CLI → production
```

---

## Screenshots

### Home — Your Appointments

<img width="2560" height="1342" alt="image" src="https://github.com/user-attachments/assets/ea18c95a-d995-43ce-b3ce-def51cebe491" />


---

### Book an Appointment — Find a Specialist

<img width="1600" height="844" alt="image" src="https://github.com/user-attachments/assets/6afe360b-b2fd-4c28-8612-ca7f92be9b60" />

---

### Select a Time Slot

<img width="1600" height="839" alt="image" src="https://github.com/user-attachments/assets/e2f9448b-6f0f-46d0-abd0-68823fb3bf57" />

---

### Confirmation

<img width="1600" height="841" alt="image" src="https://github.com/user-attachments/assets/f89e73b7-cc37-4811-935a-6ee535bca8d4" />

---

## Authors

**Andrés Chavarro · Jesús Pinzón · Laura Rodríguez · Sergio Bejarano**  
Escuela Colombiana de Ingeniería Julio Garavito
