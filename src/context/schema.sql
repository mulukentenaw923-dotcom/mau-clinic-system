-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Doctor', 'Pharmacist', 'Receptionist', 'Patient')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_or_staff_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female')),
    age INTEGER NOT NULL CHECK (age >= 0),
    department VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medical Records (Doctor EHR)
CREATE TABLE IF NOT EXISTS medical_records (
    record_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    symptoms TEXT NOT NULL,
    diagnosis TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id)
);

-- 4. Pharmacy Inventory Table
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
    medicine_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    medicine_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    expiry_date DATE NOT NULL
);

-- 5. Prescriptions Table
CREATE TABLE IF NOT EXISTS prescriptions (
    prescription_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    record_id INTEGER NOT NULL,
    medicine_id INTEGER NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Prescribed' CHECK (status IN ('Prescribed', 'Dispensed')),
    FOREIGN KEY (record_id) REFERENCES medical_records(record_id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES pharmacy_inventory(medicine_id)
);

-- 6. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    record_id INTEGER,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('Cash', 'Telebirr', 'CBE Birr', 'Student Insurance/Waived')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Waived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (record_id) REFERENCES medical_records(record_id) ON DELETE SET NULL
);

-- 7. Sick Leave Certificates Table
CREATE TABLE IF NOT EXISTS sick_leave_certificates (
    certificate_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id),
    CHECK (end_date >= start_date)
);