CREATE TABLE IF NOT EXISTS users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'doctor', 'pharmacist', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patients (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age BETWEEN 0 AND 120),
  sex TEXT NOT NULL CHECK (sex IN ('Female', 'Male', 'Other')),
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Waiting' CHECK (status IN ('Waiting', 'In consultation', 'Completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS patients_name_search_idx ON patients (LOWER(name));

CREATE TABLE IF NOT EXISTS consultations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  doctor_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  diagnosis TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sick_leaves (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  requested_by BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  starts_on DATE NOT NULL,
  ends_on DATE NOT NULL,
  diagnosis TEXT NOT NULL DEFAULT '',
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Declined')),
  reviewed_by BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (ends_on >= starts_on)
);

ALTER TABLE sick_leaves ADD COLUMN IF NOT EXISTS diagnosis TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS medicines (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reorder_level INTEGER NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
  expires_on DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS prescriptions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  consultation_id BIGINT NOT NULL REFERENCES consultations(id) ON DELETE RESTRICT,
  medicine_name TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Ready' CHECK (status IN ('Ready', 'Dispensed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  university_id VARCHAR(80),
  email VARCHAR(254) NOT NULL,
  campus VARCHAR(40) NOT NULL CHECK (campus IN ('Main Campus', 'Tulu Awulya', 'Ginba')),
  subject VARCHAR(160) NOT NULL,
  message VARCHAR(3000) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS contact_messages_campus_idx ON contact_messages (campus, created_at DESC);
