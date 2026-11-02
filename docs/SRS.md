# System Requirements Specification

## 1. Purpose

This SRS defines the requirements for a web-based student and staff clinic management system serving MAU Main Campus, Tulu Awulya, and Ginba. It is the baseline for implementation and acceptance; MAU must confirm the operational, privacy, and retention policies before real records are used.

## 2. System Context

The system consists of a React/Vite browser client, an Express REST API, and MongoDB Atlas accessed through Mongoose. Public pages are separated from authenticated staff workflows. The API owns validation, authorization, workflow state, and data persistence. The browser must not be trusted to enforce access control.

## 3. User Classes and Permissions

| Role | Main permissions |
|---|---|
| Super Admin | Create/disable staff accounts, assign roles, configure approved settings, review audit events, coordinate backup operations. No routine clinical access by default. |
| Receptionist | Search by MAU ID, register patients, view permitted identity details, create and review queue entries. |
| Triage Nurse | View assigned queue, record blood pressure, temperature, pulse, SpO2, weight and height, calculate BMI, assign routine/urgent/emergency priority, assign clinician. |
| Doctor / Health Officer | Read relevant patient history, create encounters and diagnoses, write prescriptions, request sick leave, approve/decline certificates, review lab results when enabled. |
| Pharmacist | Read prescriptions needed for fulfillment, dispense eligible medicines, manage batches and stock, review expiry and reorder warnings. |
| Student / Staff / Visitor | Read public information. A patient may see their own limited queue details and retrieve an approved certificate using MAU ID plus a separate verification code. |

Authorization is enforced by API middleware on every protected route. Role-specific screen visibility is a usability feature, never a security boundary.

## 4. Functional Requirements

### Public Website

- **PUB-01 Home:** show verified university/clinic branding, campuses served, configured emergency contact, clinic status, operating hours, service links, and approved public statistics.
- **PUB-02 About:** describe clinic background, mission, vision, patient-care/confidentiality/efficiency values, and staff groups.
- **PUB-03 Services:** describe reception, triage, consultation, e-prescriptions, pharmacy, emergency care, and medical certificates.
- **PUB-04 Contact:** accept name, optional MAU ID, email, campus, subject, and message; validate and rate-limit submissions; store them for authorized follow-up.
- **PUB-05 Patient portal:** allow queue lookup by MAU ID and campus. Return queue number, status, position, and update time only. Never return identity or clinical details from this endpoint.
- **PUB-06 Certificates:** issue downloads only for approved certificates and require MAU ID plus a high-entropy verification code. Return a PDF and do not expose diagnosis in public queue responses.
- **PUB-07 Announcements:** provide an approved, non-clinical announcement feed. Only designated staff may publish notices.

### Authentication and Staff Administration

- **AUTH-01:** verify email/password against bcrypt hashes and issue an expiring JWT with user ID and role.
- **AUTH-02:** reject inactive accounts and invalid/expired tokens; never return password hashes.
- **AUTH-03:** only Super Admin may provision users or assign roles. Public self-registration is prohibited.
- **AUTH-04:** rate-limit login and account creation; record security events without logging passwords or tokens.

### Reception and Queue

- **REC-01:** search existing records by MAU ID and name with bounded results.
- **REC-02:** register students/staff with MAU ID and visitors without one; prevent duplicate MAU IDs.
- **REC-03:** allocate a unique, sequential queue number per campus and clinic-local date using an atomic counter.
- **REC-04:** allow authorized staff to transition queue states; preserve timestamps and actors.

### Triage

- **TRI-01:** record blood pressure, temperature, pulse, SpO2, weight, and height with range validation.
- **TRI-02:** calculate BMI from valid height and weight; do not treat BMI as a diagnosis.
- **TRI-03:** classify routine, urgent, or emergency priority and assign a clinician.
- **TRI-04:** preserve an immutable record of triage changes and the responsible user.

### Clinical Encounter and Certificates

- **CLN-01:** create encounter linked to patient, provider, campus, timestamp, vitals, diagnosis, notes, and prescriptions.
- **CLN-02:** restrict clinical history to roles with a care relationship or approved administrative purpose.
- **CLN-03:** create a pending medical-leave request with dates and reason; reject an end date earlier than its start date.
- **CLN-04:** approve or decline pending certificates. Approval creates a random verification code, stores only its hash, and reveals the code once to authorized staff for secure delivery.
- **CLN-05:** prevent unauthorized modification of finalized records; use amendments with attribution instead of silent overwrites.

### Pharmacy and Inventory

- **PH-01:** manage medicine batches with name, category, batch number, quantity, unit, expiry, and reorder threshold.
- **PH-02:** surface low-stock and 30/60/90-day expiry warnings.
- **PH-03:** dispense only unexpired stock; atomically reject insufficient quantity and never permit negative inventory.
- **PH-04:** record dispensing actor, patient/encounter context, quantity, and time in an inventory ledger before production use.

### Reporting and Audit

- **AUD-01:** record actor, action, resource ID, campus, timestamp, and outcome for sensitive reads/writes; exclude secrets and unnecessary clinical text.
- **RPT-01:** provide aggregate operational reports with role-based access and privacy-aware minimum group sizes.
- **RPT-02:** clinic statistics must come from database queries and indicate their time window; do not display fabricated live figures.

## 5. Data Requirements

Mongoose collections and indexes are specified in `DATABASE_DESIGN.md`. Patient, encounter, queue, and certificate records use MongoDB ObjectIds. MAU ID is a unique business identifier for students and staff; visitors may omit it. Campus is a required controlled value. Dates are stored as UTC instants; queue date keys use `Africa/Addis_Ababa`.

## 6. External Interfaces

- REST API under `/api`; JSON request/response except PDF certificate downloads.
- MongoDB Atlas over TLS with a least-privilege database user and restricted network access.
- Future optional university identity provider, SMS/email gateway, and campus map links require MAU approval and credentials.

## 7. Non-Functional Requirements

- **Security:** HTTPS in deployment; bcrypt password hashing; JWT expiry; strict role checks; input validation; rate limiting; Helmet; secrets in a managed secret store; no PHI in URLs or client logs.
- **Privacy:** purpose-limited access, minimal public responses, approved retention/deletion policies, access audit, and privacy review before real data.
- **Availability:** set an MAU-approved service target; health endpoint distinguishes API and database availability; define manual downtime procedures.
- **Performance:** target p95 under 500 ms for routine indexed reads under agreed pilot load; cap search result sets and request sizes.
- **Accessibility:** keyboard operation, visible focus, labels, semantic headings, responsive layouts, and WCAG 2.2 AA review.
- **Maintainability:** modular models/controllers/routes, schema validation, documented environment, automated unit/API tests, and CI build gates.
- **Recovery:** define RPO/RTO and retention with MAU; enable Atlas backups and complete a successful restore drill before rollout.

## 8. Acceptance Criteria

1. All public routes render at mobile and desktop widths and client-side navigation works.
2. A new MAU ID can be registered once; duplicate IDs return a conflict without duplicate queues.
3. Queue numbers are unique per campus/date under concurrent registration.
4. Anonymous queue lookup reveals no patient name, phone, diagnosis, or prescription.
5. Invalid roles receive 403; missing/expired tokens receive 401; public registration is unavailable.
6. Emergency/urgent queue prioritization is deterministic and auditable.
7. Expired and insufficient inventory cannot be dispensed; concurrent dispense attempts cannot oversell stock.
8. Only approved certificates with correct MAU ID and verification code download as PDF.
9. API tests, frontend build, accessibility checks, security review, and backup restore exercise pass before production launch.

## 9. Current Implementation Status

The repository currently contains the public pages, React Router shell, contact/summary endpoints, JWT login, Super Admin account creation, Mongoose model/API foundation, patient registration and daily queue creation, queue lookup and triage endpoint, certificate PDF endpoint, and atomic inventory decrement endpoint. The staff dashboard still uses local sample data; triage and certificate workflows are not fully surfaced in staff UI, audit events, lab workflows, announcement management, inventory ledger, appointment scheduling, MFA, and production operational controls remain incomplete. The application is not approved for real patient data.
