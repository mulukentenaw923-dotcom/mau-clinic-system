<<<<<<< HEAD
﻿# MAU Clinic Management System

A responsive clinic management application for Mekdela Amba University. The web client uses React, Vite, Tailwind CSS, and React Router; the REST API uses Express, Mongoose, MongoDB Atlas, JWT, and bcrypt.

## Project structure

- `src/` — React frontend
- `public/` — static assets
- `backend/src/` — Express API and Mongoose models

## Prerequisites

- Node.js 20+
- A MongoDB Atlas cluster and database user

## Frontend

```bash
npm install
npm run dev
```

The frontend runs at http://localhost:5173. Vite proxies `/api` requests to the local API on port 4000.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The API runs at http://localhost:4000.

### Configuration

Use a dedicated Atlas database user with least privilege, restrict cluster network access, and use TLS. The application does not create seed patient records.

## Useful scripts

```bash
npm run build
npm run lint
cd backend && npm run db:setup
```

See [docs/PROJECT_PROPOSAL.md](docs/PROJECT_PROPOSAL.md), [docs/SRS.md](docs/SRS.md), and [docs/DATABASE_DESIGN.md](docs/DATABASE_DESIGN.md) for scope, requirements, data model, and API contracts. Do not enter real patient information until security, privacy, backups, retention, and operational procedures are approved for MAU.
=======
# mau-clinic-system
>>>>>>> 32f5318cdff4a74bf04a36a8c71e3f6b99b917e4
