# Paisa — Expense Tracker (Frontend Prototype)

Milestone 1: a frontend-only demo of a personal finance app for the Indian context (₹ INR).
All data is **dummy data** held in React state. No backend, database, SMS access, auth or real notifications.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Tech stack

React 18 · Vite · Tailwind CSS 3 · Recharts · lucide-react

## Folder structure

```
src/
  data/mockData.js     all mock data (expenses, budgets, cards, goals, trips, SMS detections)
  utils/format.js      INR + date helpers
  components/          shared UI (ui.jsx), navigation, expense form
  pages/               Dashboard, Expenses, Budgets, CreditCards, Savings, Trips, Reports, Settings, SMS
  App.jsx              layout, global state, modals
```

## What works (in memory only; resets on refresh)

Add / edit / delete expenses · search, filter, sort · create budgets · add cards, record payments ·
add trips and trip expenses with settlement maths · confirm / edit / ignore detected transactions · settings toggles.

## Mocked now → connected later

| Mocked now | Later |
| --- | --- |
| `src/data/mockData.js` | REST API + database (Spring Boot / MySQL) |
| SMS detections list | Android SMS reader + parser |
| Export PDF / XLSX "Coming soon" | Real report generation |
| Settings toggles | Persisted preferences, notifications, biometrics |

## Deploy to GitHub Pages

1. Set `base` in `vite.config.js` to `"/<repo-name>/"`.
2. `npm run build`, then publish the `dist` folder (e.g. with the `gh-pages` package or a GitHub Actions workflow).
