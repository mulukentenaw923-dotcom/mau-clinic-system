# MAU Clinic API

Express REST API backed by MongoDB Atlas through Mongoose.

## Setup

1. Copy `.env.example` to `.env` and configure `MONGODB_URI`, a random `JWT_SECRET` of at least 32 characters, and `FRONTEND_ORIGIN`.
2. Install dependencies with `npm install` from this directory.
3. Configure `SUPER_ADMIN_NAME`, `SUPER_ADMIN_EMAIL`, and a unique `SUPER_ADMIN_PASSWORD` (12–72 characters), then run `npm run db:setup` once. The command creates indexes and bootstraps a super admin only if none exists. Remove the bootstrap password afterward.
4. Start with `npm run dev`; the API listens on port 4000.

## API summary

- `POST /api/auth/login`; `POST /api/auth/register` is super-admin only
- `GET|POST /api/patients`; `GET /api/patients/queue`; `PATCH /api/patients/queue/:id/triage`
- `POST /api/ehr/consultations`; `GET|POST /api/ehr/sick-leaves`; `PATCH /api/ehr/sick-leaves/:id`
- `GET|POST /api/inventory`; `PATCH|DELETE /api/inventory/:id`; `POST /api/inventory/:id/dispense`
- `POST /api/v1/public/contact`; `GET /api/v1/public/queue`; `GET /api/v1/public/summary`; `POST /api/v1/public/certificates`
- `GET /api/health`

Protected routes require `Authorization: Bearer <accessToken>`. Public queue lookup returns only queue metadata. Certificates require both the patient's MAU ID and a high-entropy verification code issued once on approval.

Run model validation tests with `npm test`; these do not require a live Atlas connection.

Before production use, complete the security and privacy work identified in `docs/SRS.md`: audit logging, session revocation, MFA, approved retention and backup policies, monitoring, recovery drills, and legal review. Existing PostgreSQL data is not automatically migrated.
