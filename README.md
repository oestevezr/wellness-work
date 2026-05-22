# Healthy Workspace Companion

Desktop MVP scaffold for a healthy workstation companion built with **Tauri + React + TypeScript + Tailwind + Zustand**.

## What is scaffolded

- Workspace setup onboarding (setup type, friction level, schedule, hydration goal)
- Mode switching (sitting, standing, walking)
- Adaptive recommendation engine stub
- Hydration quick-add system with progress tracking
- Reminder-oriented dashboard placeholders
- Floating widget HUD (`mode | hydration | next eye break`)
- Local-first persistence scaffold (SQLite via Tauri plugin with browser fallback for web preview)
- Tauri shell prepared with SQLite plugin enabled

## Project structure

- `src/features` presentation flows (onboarding/dashboard)
- `src/components` shared UI blocks
- `src/domain` business rules (hydration + routine adaptation)
- `src/state` Zustand app state
- `src/persistence` persistence abstraction
- `src/types` core data models
- `src-tauri` native desktop host

## Run

```bash
npm install
npm run dev
```

## Build web assets

```bash
npm run build
```

## Run as Tauri desktop app

```bash
npm run tauri dev
```

## MVP next steps

- Expand SQLite repositories beyond the current single-state scaffold
- Add scheduling service for eye-care/posture/hydration reminders
- Add daily analytics calculations for dashboard sections
- Add notification style controls and calm notification templates
