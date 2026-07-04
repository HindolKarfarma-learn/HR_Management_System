# PeopleFlow HRMS

Production-oriented Human Resource Management System frontend built with React 19, Vite, and Tailwind CSS. The application supports admin and employee workflows while keeping all data access behind replaceable service contracts.

## Features

- Role-aware admin and employee dashboards with Recharts visualizations
- Employee directory, filtering, sorting, pagination, editing, deletion, and detailed profiles
- Daily, weekly, and monthly attendance views with check-in/check-out actions
- Leave balances, applications, history, calendar, and admin approvals
- Employee salary summaries and admin payroll management
- Personal profiles, documents, avatar upload UI, emergency contacts, and settings
- Login, signup, password recovery, email verification, protected routes, 403, and 404 states
- Responsive sidebar/drawer layout, keyboard focus states, reduced-motion support, skeletons, and toasts

## Technology

React 19, React Router, Tailwind CSS, TanStack Query, Zustand, Axios, React Hook Form, Zod, Recharts, Framer Motion, Lucide Icons, Day.js, and React Hot Toast.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

### Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@peopleflow.io` | `Admin@123` |
| Employee | `employee@peopleflow.io` | `Employee@123` |

The login page also provides buttons that fill these credentials.

## Quality checks

```bash
npm run lint
npm run build
npm run check
```

## Architecture

```text
src/
├── app/          # providers and application entry
├── components/   # reusable UI, forms, tables, cards, layout
├── features/     # auth, dashboard, employees, attendance, leave, payroll, profile
├── services/     # backend-independent data contracts
├── mock/         # realistic development datasets
├── routes/       # lazy routes and authorization guards
├── layouts/      # public and authenticated shells
├── store/        # Zustand session and UI state
├── hooks/        # shared hooks
├── lib/          # library configuration
└── utils/        # framework-independent helpers
```

Pages and components never import mock JSON. A feature calls its service, and the service currently returns mock data with simulated latency. To connect the backend, replace the implementation inside the corresponding service with the configured Axios client; feature UI and query hooks remain unchanged.

For example:

```js
// Current
return copy(mockEmployees);

// Backend integration
const { data } = await api.get('/employees');
return data;
```

Set `VITE_API_URL` in `.env` to configure the API base URL.

## Mock data

The repository includes 50 realistic employees, 1,750 attendance entries, leave requests, payroll records, notifications, and dashboard activity. Regenerate deterministic mock datasets with:

```bash
node scripts/generateMockData.mjs
```

## Backend note

The backend is intentionally independent. Existing planning material proposes FastAPI, SQLAlchemy, and MySQL; this frontend only depends on the service contracts in `src/services`.
