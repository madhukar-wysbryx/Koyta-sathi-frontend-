# Koyta-Sathi — Frontend

Web application for the Koyta-Sathi budgeting tool, designed for sugarcane workers in Maharashtra as part of a Harvard University & SOPPECOM research initiative.

Built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**. Web-first, fully responsive for mobile browsers.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM 6 |
| State Management | Zustand (with persistence) |
| HTTP Client | Axios |
| Forms | React Hook Form |
| AI | Google Gemini API |

---

## Project Structure

```
src/
├── api/
│   ├── axios.config.ts    # Axios instance, auth interceptors
│   ├── auth.api.ts        # Signup, login
│   ├── user.api.ts        # Profile
│   ├── ledger.api.ts      # Transactions
│   ├── quiz.api.ts        # Budget quiz
│   ├── priority.api.ts    # Priority plans
│   ├── past-season.api.ts # Historical data
│   └── gemini.api.ts      # AI features
├── components/
│   ├── Layout/            # Layout, sidebar, bottom nav
│   └── UI/                # Button, Card, Input, Modal, ProgressBar, Loader, Toast
├── hooks/                 # useAuth, useLocalStorage, useMediaQuery
├── pages/
│   ├── Login/             # Login & signup
│   ├── Dashboard/         # Home screen with stats
│   ├── Ledger/            # Transaction history & entry
│   ├── Profile/           # User profile management
│   └── Onboarding/        # 10-step onboarding flow
├── routes/                # AppRoutes, PrivateRoute
├── store/
│   └── authStore.ts       # Zustand auth state (persisted)
├── types/                 # Shared TypeScript interfaces
└── utils/                 # formatters, validators
```

---

## Prerequisites

- Node.js 18+
- Backend running on `http://localhost:3000` (see [backend README](../koyta-sathi-backend/README.md))

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Available Scripts

```bash
# Start development server
npm run dev

# Type-check without emitting
npx tsc --noEmit

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

---

## Key Features

### Authentication
- Phone number + password login and signup
- JWT token stored via Zustand persist middleware
- Auto token injection on every API request via Axios interceptor
- Auto redirect to `/login` on 401 responses (except auth routes)

### Onboarding Flow (10 steps)
1. Welcome screen & research disclaimer
2. Profile setup
3. Geeta Tai's budgeting story
4. Budget literacy quiz
5. Quiz results with AI explanations
6. Prioritizing game
7. Past season data entry
8. Priority plan introduction
9. Priority plan item selection
10. Ready to track

### Dashboard
- Advance summary (total borrowed, repaid, remaining)
- Visual progress bar
- Active priority plan preview
- Quick action shortcuts

### Ledger
- Full transaction history
- Desktop: sortable table view
- Mobile: card list view
- Add advance taken or repayment via modal
- Floating action button on mobile

### Profile
- Edit name and village
- View onboarding status
- Sign out

### AI Features (Gemini)
- Budget advice based on spending patterns
- Quiz answer explanations
- Voice-to-expense input
- Story narration

---

## Layout System

The app uses a responsive layout with two modes:

| Breakpoint | Navigation |
|---|---|
| `md` and above (≥768px) | Fixed sidebar (260px) with nav links and user info |
| Below `md` (<768px) | Top header bar + bottom tab navigation |

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:3000/api`) |
| `GEMINI_API_KEY` | Google Gemini API key for AI features |
