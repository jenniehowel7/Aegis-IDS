# Aegis IDS Frontend

This repository currently contains the active frontend application at the repository root.

## Current Status
- Core pages implemented: `/auth`, `/dashboard`, `/live`, `/batch`, `/model`, `/incidents`, `/profile`
- Role-based access is enabled (`Individual`, `Company`, `Admin`)
- Current default mode uses local frontend demo data in `lib/mock-data.ts`
- API behavior layer is in `lib/api.ts`

## Run Locally
From repository root:

```bash
npm install
npm run dev
```

If port 3000 is busy:

```bash
npm run dev -- -p 3002
```

Production run:

```bash
npm run build
npm run start -- -p 3002
```

## Team Handoff Document
For frontend/backend/AI integration scope and model requirements, use:

- `FRONTEND_BACKEND_AI_HANDOFF.md`
