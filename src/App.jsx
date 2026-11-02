<<<<<<< HEAD
import { useEffect, useRef, useState } from 'react';
import {
  BadgeCheck,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  FileText,
  LayoutDashboard,
  Pill,
  ReceiptText,
  Search,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  UsersRound,
} from 'lucide-react';
import Header from './components/Header.jsx';
import PublicSite from './features/public-site/PublicSite.jsx';
import PatientPortal from './features/public-site/PatientPortal.jsx';
import UserManagementPage from './features/admin/UserManagementPage.jsx';
import { Navigate, Route, Routes } from 'react-router-dom';
import { readApiResponse } from './services/api.js';

const STORAGE_KEY = 'mekdela-clinic-demo-data';
const SEED_DATA = {
  patients: [
    { id: 'P-1048', name: 'Selamawit Bekele', age: 24, sex: 'Female', phone: '0911 234 567', status: 'Waiting', visits: [] },
    { id: 'P-1047', name: 'Dawit Alemu', age: 31, sex: 'Male', phone: '0912 345 678', status: 'Waiting', visits: [] },
    { id: 'P-1046', name: 'Hana Tadesse', age: 19, sex: 'Female', phone: '0913 456 789', status: 'In consultation', visits: [] },
    { id: 'P-1045', name: 'Yonas Girma', age: 42, sex: 'Male', phone: '0914 567 890', status: 'Completed', visits: [] },
  ],
  inventory: [
    { id: 'M-01', name: 'Paracetamol 500 mg', category: 'Pain relief', quantity: 120, reorder: 30, expiry: '2027-08-30' },
    { id: 'M-02', name: 'Amoxicillin 500 mg', category: 'Antibiotic', quantity: 68, reorder: 20, expiry: '2027-04-12' },
    { id: 'M-03', name: 'Oral rehydration salts', category: 'Rehydration', quantity: 14, reorder: 25, expiry: '2027-01-20' },
    { id: 'M-04', name: 'Ibuprofen 200 mg', category: 'Pain relief', quantity: 56, reorder: 20, expiry: '2027-11-05' },
  ],
  leaves: [
    { id: 'SL-207', patientId: 'P-1047', patientName: 'Dawit Alemu', from: '2026-10-26', to: '2026-10-28', reason: 'Acute illness', status: 'Pending', created: '2026-10-26' },
  ],
  appointments: [],
  prescriptions: [],
  payments: [],
  doctors: [],
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'doctor', label: 'Doctor EHR', icon: Stethoscope },
  { id: 'patients', label: 'Patients Directory', icon: UsersRound },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'payments', label: 'Payments & Billing', icon: ReceiptText },
  { id: 'leave', label: 'Sick Leave Certificate Generator', icon: FileText },
];

function readSavedData() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...SEED_DATA, ...JSON.parse(saved) } : SEED_DATA;
  } catch (error) {
    console.error('Could not load demo clinic data from local storage.', error);
    return SEED_DATA;
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function App() {
  return (
    <Routes>
      <Route element={<PublicSite />} path="/" />
      <Route element={<PublicSite />} path="/about" />
      <Route element={<PublicSite />} path="/services" />
      <Route element={<PublicSite />} path="/contact" />
      <Route element={<PatientPortal />} path="/portal" />
      <Route element={<StaffWorkspace />} path="/login" />
      <Route element={<StaffWorkspace />} path="/staff/*" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}

function StaffWorkspace() {
  const [data, setData] = useState(readSavedData);
  const currentData = useRef(data);
  const [page, setPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [notice, setNotice] = useState('');

  function logout() {
    try {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    } catch (error) {
      console.error('Could not clear saved authentication data.', error);
    }
    setPage('dashboard');
    setUser(null);
  }

  function updateData(updater) {
    const nextData = typeof updater === 'function' ? updater(currentData.current) : updater;
    currentData.current = nextData;
    setData(nextData);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    } catch (error) {
      console.error('Could not save demo clinic data to local storage.', error);
      setNotice('Local storage is unavailable. Changes may not persist after refresh.');
    }
  }

  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  if (!user) return <WelcomePage onSignIn={setUser} />;

  const visibleNavItems = user.role === 'super_admin'
    ? [...NAV_ITEMS, { id: 'users', label: 'User management', icon: UserPlus }]
    : NAV_ITEMS;
=======
import { useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

const roles = [
  { id: 'cardroom', label: 'Card Room', description: 'Patient registration and search' },
  { id: 'doctor', label: 'Doctor', description: 'Queue and consultations' },
  { id: 'pharmacy', label: 'Pharmacy', description: 'Prescriptions and inventory' },
  { id: 'admin', label: 'Admin', description: 'Reports and staff management' },
];

const initialPatients = [
  { id: 'P-1001', name: 'Selam Bekele', age: 25, department: 'General', status: 'Waiting' },
  { id: 'P-1002', name: 'Abebe Tadesse', age: 38, department: 'Cardiology', status: 'In Consultation' },
  { id: 'P-1003', name: 'Hawi Alemu', age: 31, department: 'Orthopedics', status: 'Admitted' },
  { id: 'P-1004', name: 'Daniel Bekele', age: 45, department: 'Dental', status: 'Waiting' },
];

const initialQueue = [
  { id: 'Q-001', patient: 'Selam Bekele', doctor: 'Dr. Mulu', time: '09:00 AM' },
  { id: 'Q-002', patient: 'Mekdes Alem', doctor: 'Dr. Daniel', time: '09:15 AM' },
  { id: 'Q-003', patient: 'Abebe Tadesse', doctor: 'Dr. Mulu', time: '09:30 AM' },
];

const initialPrescriptions = [
  { id: 'RX-204', patient: 'Selam Bekele', medicine: 'Amoxicillin 500mg', status: 'Pending' },
  { id: 'RX-205', patient: 'Hawi Alemu', medicine: 'Ibuprofen 200mg', status: 'Ready' },
  { id: 'RX-206', patient: 'Abebe Tadesse', medicine: 'Paracetamol', status: 'Dispensed' },
];

const initialInventory = [
  { item: 'Amoxicillin 500mg', stock: 84, reorderLevel: 20 },
  { item: 'Ibuprofen 200mg', stock: 52, reorderLevel: 25 },
  { item: 'Paracetamol', stock: 37, reorderLevel: 15 },
  { item: 'Insulin', stock: 19, reorderLevel: 20 },
];

const initialStaff = [
  { name: 'Aster Bekele', role: 'Nurse', status: 'On Duty' },
  { name: 'Kebede Yitbarek', role: 'Doctor', status: 'Consulting' },
  { name: 'Samuel Asfaw', role: 'Pharmacist', status: 'Available' },
  { name: 'Meron Alemu', role: 'Admin', status: 'On Duty' },
];

function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('cardroom');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.');
      return;
    }

    setError('');
    navigate(`/dashboard/${selectedRole}`);
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="brand-block">
          <div className="brand-badge">MAU</div>
          <h1>Mekdela Amba University</h1>
          <p>Clinic Management System</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="role-grid">
            {roles.map((role) => (
              <button
                type="button"
                key={role.id}
                className={`role-button ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                <strong>{role.label}</strong>
                <span>{role.description}</span>
              </button>
            ))}
          </div>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@mau.edu.et"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" className="primary-button">
            Sign in as {roles.find((role) => role.id === selectedRole)?.label}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardLayout({ title, children, selectedRole }) {
  const navigate = useNavigate();

  const navItems = [
    { path: 'cardroom', label: 'Card Room' },
    { path: 'doctor', label: 'Doctor' },
    { path: 'pharmacy', label: 'Pharmacy' },
    { path: 'admin', label: 'Admin' },
  ];

  const shortcuts = {
    cardroom: ['Register Patient', 'Patient Search', 'Queue'],
    doctor: ['Pending Cases', 'Consultation', 'Prescription'],
    pharmacy: ['Prescription Queue', 'Inventory', 'Stock'],
    admin: ['Overview', 'Staff', 'Reports'],
  };
>>>>>>> 32f5318cdff4a74bf04a36a8c71e3f6b99b917e4

  return (
    <div className="app-shell">
      <aside className="sidebar">
<<<<<<< HEAD
        <a className="brand" href="#overview" onClick={() => setPage('dashboard')}>
          <span className="brand-mark"><img alt="" src="/logo-mekdela-amba.png" /></span>
          <span><strong>Mekdela Amba University</strong><small>CLINIC MANAGEMENT SYSTEM</small></span>
        </a>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {visibleNavItems.map((item) => (
            <button aria-current={page === item.id ? 'page' : undefined} className={`nav-item ${page === item.id ? 'active' : ''}`} key={item.id} onClick={() => setPage(item.id)} type="button">
              <span className="nav-icon" aria-hidden="true"><item.icon size={18} strokeWidth={1.8} /></span>{item.label}
              {item.id === 'leave' && data.leaves.some((leave) => leave.status === 'Pending') && <span className="nav-dot" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="demo-callout" onClick={() => setPage('dashboard')} type="button" aria-label="Demo workspace, return to overview">
            <span className="status-dot" /> Demo workspace <small>Sample records only</small>
          </button>
          <button className="profile-button" onClick={logout} type="button" aria-label="Log out">
            <span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span>
            <span className="profile-info"><strong>{user.name}</strong><small>{user.role}</small></span>
            <span className="logout-label"><span aria-hidden="true">↪</span> Log out</span>
          </button>
        </div>
      </aside>

      <main className="main-area">
        <Header
          onLogout={logout}
          title={visibleNavItems.find((item) => item.id === page)?.label ?? 'Overview'}
          userName={user.name}
          userRole={user.role}
        />
        {notice && <div className="toast" role="status">{notice}<button onClick={() => setNotice('')} type="button" aria-label="Dismiss notification">×</button></div>}
        <div className="content page-transition" key={page}>
          {page === 'dashboard' && <Dashboard data={data} onNavigate={setPage} />}
          {page === 'appointments' && <AppointmentsPage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'patients' && <PatientsPage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'doctor' && <ConsultationsPage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'leave' && <LeavePage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'pharmacy' && <PharmacyPage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'payments' && <PaymentsPage data={data} updateData={updateData} notify={setNotice} />}
          {page === 'users' && user.role === 'super_admin' && <UserManagementPage />}
          <footer className="app-footer"><span>MA</span> Mekdela Amba University <span className="footer-separator">·</span> Demo environment — do not enter real patient information</footer>
        </div>
=======
        <div className="sidebar-brand">MAU Clinic</div>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${selectedRole === item.path ? 'active' : ''}`}
              onClick={() => navigate(`/dashboard/${item.path}`)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="logout-button" onClick={() => navigate('/')}>
          Logout
        </button>
      </aside>

      <main className="content-panel">
        <header className="topbar">
          <div>
            <span className="eyebrow">Overview</span>
            <h2>{title}</h2>
          </div>
          <div className="user-pill">System User</div>
        </header>

        <div className="quick-actions">
          {shortcuts[selectedRole]?.map((item) => (
            <div key={item} className="action-chip">{item}</div>
          ))}
        </div>

        {children}
>>>>>>> 32f5318cdff4a74bf04a36a8c71e3f6b99b917e4
      </main>
    </div>
  );
}

<<<<<<< HEAD
function WelcomePage({ onSignIn }) {
  return (
    <main className="welcome-screen">
      <section className="welcome-layout">
        <div className="welcome-hero">
          <img alt="Mekdela Amba University campus" className="welcome-hero-image" src="/clinic-campus.png" />
          <div className="welcome-hero-shade" />
          <div className="welcome-hero-content">
            <span className="welcome-hero-mark" aria-hidden="true">✚</span>
            <div className="welcome-hero-kicker">MEKDELA AMBA UNIVERSITY</div>
            <h2>Care for our campus community.</h2>
            <p>Clinic Management System</p>
            <span className="welcome-hero-rule" />
          </div>
          <span className="welcome-hero-caption">A healthier community starts here</span>
        </div>
        <SignInForm onSignIn={onSignIn} />
      </section>
    </main>
  );
}

function SignInForm({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Enter both your email address and password to continue.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const result = await readApiResponse(response);
      if (!response.ok) throw new Error(result.error || result.message || `Unable to sign in (${response.status}).`);
      if (!result.user || !result.accessToken) throw new Error('The server returned an incomplete login response.');
      window.localStorage.setItem('token', result.accessToken);
      window.localStorage.setItem('user', JSON.stringify(result.user));
      onSignIn({ name: result.user.name, role: result.user.role });
    } catch (requestError) {
      setError(requestError.message || 'Unable to sign in. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="signin-card">
      <h1>Welcome to Mekdela Amba University</h1>
      <p className="login-copy">Clinic Management System · Sign in to access your clinic dashboard.</p>
      <form className="form-stack" onSubmit={submit}>
        <label htmlFor="login-email">Email address
          <span className="input-wrap">
            <svg aria-hidden="true" className="field-icon" fill="none" viewBox="0 0 20 20">
              <rect height="12" rx="2" stroke="currentColor" strokeWidth="1.5" width="16" x="2" y="4" />
              <path d="m3 5 7 5 7-5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input autoComplete="username" id="login-email" onChange={(event) => { setEmail(event.target.value); setError(''); }} placeholder="name@university.edu" required type="email" value={email} />
          </span>
        </label>
        <div className="password-field">
          <label htmlFor="login-password">Password</label>
          <span className="input-wrap">
            <svg aria-hidden="true" className="field-icon" fill="none" viewBox="0 0 20 20">
              <rect height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" width="14" x="3" y="9" />
              <path d="M6 9V6a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <input autoComplete="current-password" id="login-password" onChange={(event) => { setPassword(event.target.value); setError(''); }} placeholder="Enter your password" required type={showPassword ? 'text' : 'password'} value={password} />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="password-visibility"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? (
                <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path d="M3 3l14 14M8.6 8.7a2 2 0 0 0 2.7 2.7M7 5.5A9.5 9.5 0 0 1 10 5c4.2 0 7.2 3.1 8 5-.3.8-1 1.7-2 2.6M5.2 6.8C3.4 7.9 2.3 9.3 2 10c.8 1.9 3.8 5 8 5 1 0 1.9-.2 2.7-.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
                  <path d="M2 10c.8-1.9 3.8-5 8-5s7.2 3.1 8 5c-.8 1.9-3.8 5-8 5s-7.2-3.1-8-5Z" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
            </button>
          </span>
        </div>
        {error && <p className="login-error" role="alert">{error}</p>}
        <button className="welcome-button login-submit" disabled={isSubmitting} type="submit">
          <svg aria-hidden="true" fill="none" height="16" viewBox="0 0 16 16" width="16">
            <rect height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" width="10" x="3" y="7" />
            <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="account-prompt">Staff accounts are provisioned by a clinic administrator.</p>
      <p className="privacy-note"><span aria-hidden="true">ⓘ</span> Demo workspace records are local sample data.</p>
=======
function CardRoomDashboard() {
  const patients = useMemo(() => initialPatients, []);

  return (
    <DashboardLayout title="Card Room Dashboard" selectedRole="cardroom">
      <div className="stats-grid">
        <StatCard label="Total Patients" value="1,240" tone="blue" />
        <StatCard label="New Today" value="32" tone="green" />
        <StatCard label="Pending Review" value="14" tone="amber" />
        <StatCard label="Discharged" value="86" tone="purple" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Recent Patients</h3>
          <button className="small-button">Register Patient</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Department</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.age}</td>
                <td>{patient.department}</td>
                <td>
                  <span className={`status-badge ${patient.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}

function DoctorDashboard() {
  const queue = useMemo(() => initialQueue, []);

  return (
    <DashboardLayout title="Doctor Dashboard" selectedRole="doctor">
      <div className="stats-grid">
        <StatCard label="Today Queue" value="26" tone="blue" />
        <StatCard label="Consulted" value="18" tone="green" />
        <StatCard label="Pending" value="8" tone="amber" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Queue</h3>
          <button className="small-button">Add Consultation</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.patient}</td>
                <td>{item.doctor}</td>
                <td>{item.time}</td>
                <td><button className="mini-button">Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}

function PharmacyDashboard() {
  const prescriptions = useMemo(() => initialPrescriptions, []);
  const inventory = useMemo(() => initialInventory, []);

  return (
    <DashboardLayout title="Pharmacy Dashboard" selectedRole="pharmacy">
      <div className="stats-grid">
        <StatCard label="Pending Rx" value="11" tone="amber" />
        <StatCard label="Dispensed" value="48" tone="green" />
        <StatCard label="Low Stock" value="3" tone="purple" />
      </div>

      <section className="panel split-panel">
        <div>
          <div className="panel-header">
            <h3>Prescription Queue</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Medicine</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.patient}</td>
                  <td>{item.medicine}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="panel-header">
            <h3>Inventory</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Stock</th>
                <th>Reorder</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.item}>
                  <td>{item.item}</td>
                  <td>{item.stock}</td>
                  <td>{item.reorderLevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

function AdminDashboard() {
  const staff = useMemo(() => initialStaff, []);

  return (
    <DashboardLayout title="Admin Dashboard" selectedRole="admin">
      <div className="stats-grid">
        <StatCard label="Staff Active" value="86" tone="blue" />
        <StatCard label="Revenue" value="$14.2K" tone="green" />
        <StatCard label="Reports" value="23" tone="purple" />
      </div>

      <section className="panel">
        <div className="panel-header">
          <h3>Staff Management</h3>
          <button className="small-button">Add Access</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.name}>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={`stat-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
>>>>>>> 32f5318cdff4a74bf04a36a8c71e3f6b99b917e4
    </div>
  );
}

<<<<<<< HEAD
function PageHeading({ eyebrow, title, description, action, className = '' }) {
  return <div className={`page-heading ${className}`}><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function Dashboard({ data, onNavigate }) {
  const waiting = data.patients.filter((patient) => patient.status === 'Waiting');
  const pendingLeaves = data.leaves.filter((leave) => leave.status === 'Pending').length;
  const lowStock = data.inventory.filter((item) => item.quantity <= item.reorder);
  return (
    <>
      <PageHeading eyebrow="MONDAY, OCTOBER 26, 2026" title="Good morning" description="Here’s what’s happening at your clinic today." action={<button className="button button-primary" onClick={() => onNavigate('patients')} type="button"><span>＋</span> Register patient</button>} />
      <div className="demo-banner"><span className="banner-icon">i</span><span><strong>Demo workspace</strong> — All information is sample data saved only in this browser.</span><button type="button" aria-label="Dismiss">×</button></div>
      <div className="stat-grid">
        <StatCard label="Patients today" value={data.patients.length} detail="Registered in this workspace" icon="♡" color="mint" />
        <StatCard label="Waiting for care" value={waiting.length} detail="Patients in the queue" icon="◷" color="blue" />
        <StatCard label="Pending leave" value={pendingLeaves} detail="Awaiting review" icon="▤" color="amber" />
        <StatCard label="Low stock items" value={lowStock.length} detail="At or below reorder level" icon="⚕" color="rose" />
      </div>
      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading"><div><h2>Patient queue</h2><p>Patients waiting to be seen</p></div><button className="text-button" onClick={() => onNavigate('doctor')} type="button">Open workspace <span>→</span></button></div>
          <PatientRows patients={waiting.slice(0, 4)} />
          {waiting.length === 0 && <EmptyState title="Queue is clear" body="Newly registered patients will appear here." />}
        </section>
        <section className="panel">
          <div className="panel-heading"><div><h2>Pharmacy watch</h2><p>Items that may need restocking</p></div><button className="text-button" onClick={() => onNavigate('pharmacy')} type="button">View inventory <span>→</span></button></div>
          {lowStock.length ? lowStock.slice(0, 3).map((item) => <div className="stock-watch" key={item.id}><span className="medicine-icon">Rx</span><span className="stock-name"><strong>{item.name}</strong><small>Reorder at {item.reorder} units</small></span><span className="stock-count">{item.quantity} left</span></div>) : <EmptyState title="Stock levels look good" body="No items are below their reorder level." />}
        </section>
      </div>
      <section className="panel quick-panel"><div className="panel-heading"><div><h2>Quick actions</h2><p>Jump into a common clinic task</p></div></div><div className="quick-actions"><QuickAction icon={<CalendarDays aria-hidden="true" size={18} />} title="Book appointment" onClick={() => onNavigate('appointments')} /><QuickAction icon="✚" title="Start consultation" onClick={() => onNavigate('doctor')} /><QuickAction icon="＋" title="Register patient" onClick={() => onNavigate('patients')} /><QuickAction icon="⚕" title="Dispense medicine" onClick={() => onNavigate('pharmacy')} /><QuickAction icon={<ReceiptText aria-hidden="true" size={18} />} title="Create invoice" onClick={() => onNavigate('payments')} /><QuickAction icon="▤" title="Review sick leave" onClick={() => onNavigate('leave')} /></div></section>
    </>
  );
}

function StatCard({ label, value, detail, icon, color }) {
  return <article className="stat-card"><span className={`stat-icon ${color}`}>{icon}</span><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail">{detail}</div></article>;
}

function QuickAction({ icon, title, onClick }) {
  return <button className="quick-action" onClick={onClick} type="button"><span>{icon}</span><strong>{title}</strong><i>→</i></button>;
}

function AppointmentsPage({ data, updateData, notify }) {
  const [showForm, setShowForm] = useState(false);
  const appointments = [...(data.appointments || [])].sort((first, second) => (
    `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`)
  ));

  function scheduleAppointment(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = data.patients.find((item) => item.id === form.get('patientId'));
    const appointment = {
      id: makeId('AP'),
      patientId: patient.id,
      patientName: patient.name,
      date: form.get('date'),
      time: form.get('time'),
      reason: form.get('reason').trim(),
      status: 'Scheduled',
    };
    const duplicate = appointments.some((item) => item.patientId === appointment.patientId
      && item.date === appointment.date
      && item.time === appointment.time
      && item.status !== 'Cancelled');
    if (duplicate) {
      notify('This patient already has an appointment at that time.');
      return;
    }
    updateData((current) => ({ ...current, appointments: [appointment, ...(current.appointments || [])] }));
    setShowForm(false);
    notify(`Appointment scheduled for ${patient.name}.`);
  }

  function updateAppointmentStatus(appointment, status) {
    updateData((current) => ({
      ...current,
      appointments: (current.appointments || []).map((item) => item.id === appointment.id ? { ...item, status } : item),
      patients: status === 'Checked in'
        ? current.patients.map((patient) => patient.id === appointment.patientId ? { ...patient, status: 'Waiting' } : patient)
        : current.patients,
    }));
    notify(status === 'Checked in'
      ? `${appointment.patientName} checked in and added to the doctor queue.`
      : 'Appointment cancelled.');
  }

  return (
    <>
      <PageHeading
        className="patients-page-heading appointments-page-heading"
        eyebrow="VISIT PLANNING"
        title="Appointments"
        description="Schedule clinic visits and check patients in to the doctor queue."
        action={<button className="button button-primary" disabled={data.patients.length === 0} onClick={() => setShowForm(true)} type="button"><span aria-hidden="true">＋</span> Schedule appointment</button>}
      />
      <section className="panel">
        <div className="panel-heading"><div><h2>Appointment schedule</h2><p>{appointments.length} appointments</p></div></div>
        {appointments.length ? (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>{appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td><strong>{appointment.patientName}</strong><div className="muted-cell">{appointment.patientId}</div></td>
                  <td>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(`${appointment.date}T00:00:00`))}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.reason}</td>
                  <td><StatusBadge value={appointment.status} /></td>
                  <td className="patient-actions">
                    {appointment.status === 'Scheduled' && <><button className="row-action" onClick={() => updateAppointmentStatus(appointment, 'Checked in')} type="button">Check in</button><button className="row-action patient-remove" onClick={() => updateAppointmentStatus(appointment, 'Cancelled')} type="button">Cancel</button></>}
                    {appointment.status === 'Checked in' && <button className="row-action" disabled type="button">In queue</button>}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : <EmptyState title="No appointments scheduled" body="Schedule a visit for a registered patient to get started." />}
      </section>
      {showForm && (
        <Modal title="Schedule an appointment" onClose={() => setShowForm(false)}>
          <form className="form-stack" onSubmit={scheduleAppointment}>
            <label>Patient<select autoFocus defaultValue="" name="patientId" required><option disabled value="">Select a patient</option>{data.patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>)}</select></label>
            <div className="form-row">
              <label>Date<input min={today()} name="date" required type="date" /></label>
              <label>Time<input name="time" required type="time" /></label>
            </div>
            <label>Reason for visit<input maxLength="120" name="reason" placeholder="e.g. Follow-up consultation" required /></label>
            <div className="form-actions">
              <button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button>
              <button className="button button-primary" type="submit"><CalendarDays aria-hidden="true" size={16} /> Schedule</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function PatientsPage({ data, updateData, notify }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [patientToRemove, setPatientToRemove] = useState(null);
  const patients = data.patients.filter((patient) => {
    const matchQuery = `${patient.name} ${patient.id} ${patient.phone}`.toLowerCase().includes(query.toLowerCase());
    return matchQuery && (status === 'All statuses' || patient.status === status);
  });
  function hasPatientHistory(patient) {
    return patient.visits?.length > 0
      || data.leaves.some((leave) => leave.patientId === patient.id)
      || data.prescriptions.some((prescription) => prescription.patientId === patient.id)
      || data.payments.some((payment) => payment.patientId === patient.id);
  }
  function addPatient(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = { id: makeId('P'), name: form.get('name').trim(), age: Number(form.get('age')), sex: form.get('sex'), phone: form.get('phone').trim(), status: 'Waiting', visits: [] };
    updateData((current) => ({ ...current, patients: [patient, ...current.patients] }));
    setShowForm(false);
    notify(`${patient.name} added to the patient list.`);
  }
  function removePatient(patient) {
    if (hasPatientHistory(patient)) {
      setPatientToRemove(null);
      notify('This patient has medical or sick-leave history and cannot be removed.');
      return;
    }
    updateData((current) => ({
      ...current,
      patients: current.patients.filter((item) => item.id !== patient.id),
    }));
    setPatientToRemove(null);
    notify(`${patient.name} removed from the patient list.`);
  }
  function requestPatientRemoval(patient) {
    if (hasPatientHistory(patient)) {
      notify('This patient has medical or sick-leave history and cannot be removed.');
      return;
    }
    setPatientToRemove(patient);
  }
  return (
    <>
      <PageHeading className="patients-page-heading" eyebrow="CARE DIRECTORY" title="Patients" description="Search and manage your clinic’s patient records." action={<button className="button button-primary add-patient-button" onClick={() => setShowForm(true)} type="button"><span aria-hidden="true">＋</span> Add patient</button>} />
      <section className="panel">
        <div className="toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search patients" onChange={(event) => setQuery(event.target.value)} placeholder="Search name, patient ID or phone" value={query} /></label><select aria-label="Filter by status" className="filter-select" onChange={(event) => setStatus(event.target.value)} value={status}><option>All statuses</option><option>Waiting</option><option>In consultation</option><option>Completed</option></select><span className="result-count">{patients.length} patients</span></div>
        <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Patient ID</th><th>Age / Sex</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead><tbody>{patients.map((patient) => <tr key={patient.id}><td><button className="patient-link" onClick={() => setSelected(patient)} type="button"><span className="avatar table-avatar">{patient.name.slice(0, 1)}</span><strong>{patient.name}</strong></button></td><td className="muted-cell">{patient.id}</td><td>{patient.age} <span className="muted-cell">/ {patient.sex}</span></td><td>{patient.phone}</td><td><StatusBadge value={patient.status} /></td><td className="patient-actions"><button aria-label={`View ${patient.name}`} className="row-action" onClick={() => setSelected(patient)} type="button">View ↗</button><button aria-label={`Remove ${patient.name}`} className="row-action patient-remove" onClick={() => requestPatientRemoval(patient)} type="button">Remove</button></td></tr>)}</tbody></table>{patients.length === 0 && <EmptyState title="No patients found" body="Try another search or add a patient record." />}</div>
      </section>
      {showForm && (
        <Modal className="patient-form-modal" title="Register a patient" onClose={() => setShowForm(false)}>
          <div className="patient-form-intro">
            <span className="patient-form-icon" aria-hidden="true">+</span>
            <div><strong>New patient profile</strong><p>Enter the patient’s basic details to add them to the clinic queue.</p></div>
          </div>
          <form className="form-stack patient-form" onSubmit={addPatient}>
            <div className="patient-form-section-title">PERSONAL INFORMATION</div>
            <label>Full name<input autoFocus autoComplete="name" name="name" placeholder="e.g. Alemu Bekele" required /></label>
            <div className="form-row">
              <label>Age<input max="120" min="0" name="age" placeholder="Age in years" required type="number" /></label>
              <label>Sex<select name="sex" required defaultValue=""><option disabled value="">Select sex</option><option>Female</option><option>Male</option><option>Other</option></select></label>
            </div>
            <label>Phone number<input autoComplete="tel" name="phone" placeholder="e.g. 0912 345 678" required type="tel" /></label>
            <div className="patient-form-note"><span aria-hidden="true">i</span> This demo stores sample records only in this browser.</div>
            <div className="form-actions">
              <button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button>
              <button className="button button-primary" type="submit"><span aria-hidden="true">＋</span> Save patient</button>
            </div>
          </form>
        </Modal>
      )}
      {patientToRemove && (
        <Modal title="Remove this patient?" onClose={() => setPatientToRemove(null)}>
          <p className="confirm-copy">Remove {patientToRemove.name} from the patient list? This cannot be undone.</p>
          <div className="form-actions">
            <button className="button button-quiet" onClick={() => setPatientToRemove(null)} type="button">Cancel</button>
            <button className="button button-danger" onClick={() => removePatient(patientToRemove)} type="button">Remove patient</button>
          </div>
        </Modal>
      )}
      {selected && <Modal title="Patient record" onClose={() => setSelected(null)}><div className="patient-record"><div className="record-person"><span className="avatar record-avatar">{selected.name.slice(0, 1)}</span><div><h3>{selected.name}</h3><p>{selected.id} · {selected.age} years · {selected.sex}</p></div></div><div className="record-line"><span>Phone</span><strong>{selected.phone}</strong></div><div className="record-line"><span>Queue status</span><StatusBadge value={selected.status} /></div><h4>Consultation history</h4>{selected.visits?.length ? selected.visits.map((visit) => <div className="visit-note" key={visit.id}><strong>{visit.date}</strong><p>{visit.diagnosis}</p><small>{visit.notes}</small></div>) : <p className="empty-history">No consultation notes have been recorded.</p>}</div></Modal>}
    </>
  );
}

function ConsultationsPage({ data, updateData, notify }) {
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const eligible = data.patients.filter((patient) => patient.status !== 'Completed');
  const [selectedId, setSelectedId] = useState(eligible[0]?.id ?? '');
  const selected = data.patients.find((patient) => patient.id === selectedId);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicine, setMedicine] = useState('');
  const [instructions, setInstructions] = useState('');
  function addDoctor(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const doctor = {
      id: makeId('D'),
      name: form.get('name').trim(),
      specialty: form.get('specialty').trim(),
      phone: form.get('phone').trim(),
    };
    if (!doctor.name || !doctor.specialty || !doctor.phone) {
      notify('Enter the doctor’s name, specialty, and phone number.');
      return;
    }
    updateData((current) => ({ ...current, doctors: [doctor, ...(current.doctors || [])] }));
    setShowDoctorForm(false);
    notify(`${doctor.name} added to the doctor list.`);
  }
  function removeDoctor(doctor) {
    updateData((current) => ({ ...current, doctors: current.doctors.filter((item) => item.id !== doctor.id) }));
    setDoctorToDelete(null);
    notify(`${doctor.name} removed from the doctor list.`);
  }
  function saveConsultation(event) {
    event.preventDefault();
    if (!selected || !diagnosis.trim()) return;
    const visit = { id: makeId('V'), date: today(), diagnosis: diagnosis.trim(), notes: notes.trim() };
    const prescription = medicine.trim() ? { id: makeId('RX'), patientId: selected.id, patientName: selected.name, medicine: medicine.trim(), instructions: instructions.trim(), date: today(), status: 'Ready' } : null;
    updateData((current) => ({
      ...current,
      patients: current.patients.map((patient) => patient.id === selected.id ? { ...patient, status: 'Completed', visits: [visit, ...(patient.visits || [])] } : patient),
      appointments: (current.appointments || []).map((appointment) => appointment.patientId === selected.id && appointment.status === 'Checked in' ? { ...appointment, status: 'Completed' } : appointment),
      prescriptions: prescription ? [prescription, ...current.prescriptions] : current.prescriptions,
    }));
    setDiagnosis(''); setNotes(''); setMedicine(''); setInstructions('');
    notify(prescription ? 'Consultation saved and prescription sent to pharmacy.' : 'Consultation saved.');
  }
  return (
    <>
      <PageHeading eyebrow="CLINICAL WORKSPACE" title="Consultations" description="Review the queue, record clinical notes and prepare prescriptions." />
      <section className="panel doctor-directory-panel">
        <div className="panel-heading">
          <div><h2>Doctors</h2><p>Add and manage the doctors in this clinic.</p></div>
          <button className="button button-primary" onClick={() => setShowDoctorForm(true)} type="button"><span>＋</span> Add doctor</button>
        </div>
        {data.doctors?.length ? (
          <div className="doctor-list">
            {data.doctors.map((doctor) => (
              <article className="doctor-card" key={doctor.id}>
                <span className="doctor-avatar" aria-hidden="true">{doctor.name.slice(0, 1).toUpperCase()}</span>
                <div className="doctor-details"><strong>{doctor.name}</strong><span>{doctor.specialty}</span><small>{doctor.phone}</small></div>
                <button className="row-action doctor-remove" onClick={() => setDoctorToDelete(doctor)} type="button">Remove</button>
              </article>
            ))}
          </div>
        ) : <EmptyState title="No doctors added yet" body="Add a doctor to keep the clinic team list up to date." />}
      </section>
      <div className="consult-grid">
        <section className="panel queue-panel"><div className="panel-heading"><div><h2>Patient queue</h2><p>{eligible.length} waiting for care</p></div><span className="queue-count">{eligible.length}</span></div><PatientRows patients={eligible} selectedId={selectedId} onSelect={setSelectedId} />{eligible.length === 0 && <EmptyState title="Queue is clear" body="Register a patient to start a consultation." />}</section>
        <section className="panel consultation-panel">
          {selected ? <><div className="patient-summary"><span className="avatar record-avatar">{selected.name.slice(0, 1)}</span><div><div className="eyebrow">CURRENT PATIENT</div><h2>{selected.name}</h2><p>{selected.id} <span>·</span> {selected.age} years <span>·</span> {selected.sex}</p></div><StatusBadge value={selected.status} /></div>
            {selected.visits?.[0] && <div className="last-visit"><strong>Previous diagnosis</strong><span>{selected.visits[0].diagnosis}</span></div>}
            <form className="form-stack consultation-form" onSubmit={saveConsultation}><label>Diagnosis <span className="required">*</span><textarea onChange={(event) => setDiagnosis(event.target.value)} placeholder="Enter clinical diagnosis" required rows="3" value={diagnosis} /></label><label>Clinical notes<textarea onChange={(event) => setNotes(event.target.value)} placeholder="Symptoms, observations and care plan" rows="3" value={notes} /></label><div className="form-divider"><span>OPTIONAL PRESCRIPTION</span></div><label>Medication<input onChange={(event) => setMedicine(event.target.value)} placeholder="e.g. Paracetamol 500 mg" value={medicine} /></label>{medicine && <label>Instructions<input onChange={(event) => setInstructions(event.target.value)} placeholder="e.g. 1 tablet every 8 hours" value={instructions} /></label>}<div className="form-actions"><button className="button button-primary" type="submit">Save consultation <span>→</span></button></div></form>
          </> : <EmptyState title="Select a patient" body="Choose someone in the queue to open a consultation." />}
        </section>
      </div>
      {showDoctorForm && (
        <Modal title="Add a doctor" onClose={() => setShowDoctorForm(false)}>
          <form className="form-stack" onSubmit={addDoctor}>
            <label>Doctor name<input autoFocus name="name" placeholder="Full name" required /></label>
            <label>Specialty<input name="specialty" placeholder="e.g. General practitioner" required /></label>
            <label>Phone number<input autoComplete="tel" name="phone" placeholder="Phone number" required type="tel" /></label>
            <div className="form-actions">
              <button className="button button-quiet" onClick={() => setShowDoctorForm(false)} type="button">Cancel</button>
              <button className="button button-primary" type="submit">Save doctor</button>
            </div>
          </form>
        </Modal>
      )}
      {doctorToDelete && (
        <Modal title="Remove this doctor?" onClose={() => setDoctorToDelete(null)}>
          <p className="confirm-copy">Remove {doctorToDelete.name} from the clinic doctor list?</p>
          <div className="form-actions">
            <button className="button button-quiet" onClick={() => setDoctorToDelete(null)} type="button">Cancel</button>
            <button className="button button-danger" onClick={() => removeDoctor(doctorToDelete)} type="button">Remove doctor</button>
          </div>
        </Modal>
      )}
    </>
  );
}

function LeavePage({ data, updateData, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [startsOn, setStartsOn] = useState(today());
  const [endsOn, setEndsOn] = useState(today());
  const [diagnosis, setDiagnosis] = useState('');
  const [reason, setReason] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState('');
  const selectedPatient = data.patients.find((patient) => patient.id === selectedPatientId);
  const previewLeave = {
    id: 'PREVIEW',
    patientId: selectedPatient?.id || '',
    patientName: selectedPatient?.name || '',
    from: startsOn,
    to: endsOn,
    diagnosis,
    reason,
    status: 'Pending',
    created: today(),
  };
  const leaveDays = calculateLeaveDays(startsOn, endsOn);
  function requestLeave(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = data.patients.find((item) => item.id === form.get('patientId'));
    const formDiagnosis = String(form.get('diagnosis') || '').trim();
    const formReason = String(form.get('reason') || '').trim();
    const from = String(form.get('from') || '');
    const to = String(form.get('to') || '');
    if (!patient || !formDiagnosis || !formReason || !validDateRange(from, to)) {
      notify('Enter the patient, diagnosis, reason, and a valid date range.');
      return;
    }
    const leave = { id: makeId('SL'), patientId: patient.id, patientName: patient.name, from, to, diagnosis: formDiagnosis, reason: formReason, status: 'Pending', created: today() };
    updateData((current) => ({ ...current, leaves: [leave, ...current.leaves] }));
    setShowForm(false);
    setSelectedPatientId('');
    setStartsOn(today());
    setEndsOn(today());
    setDiagnosis('');
    setReason('');
    notify('Sick leave request submitted for review.');
  }
  function decide(id, status) {
    updateData((current) => ({ ...current, leaves: current.leaves.map((leave) => leave.id === id ? { ...leave, status } : leave) }));
    if (status === 'Approved') setSelectedCertificateId(id);
    notify(`Request ${status.toLowerCase()}.`);
  }
  const pending = data.leaves.filter((leave) => leave.status === 'Pending');
  const reviewed = data.leaves.filter((leave) => leave.status !== 'Pending');
  const selectedCertificate = reviewed.find((leave) => leave.id === selectedCertificateId)
    || reviewed.find((leave) => leave.status === 'Approved')
    || reviewed[0]
    || null;
  return (
    <>
      <PageHeading eyebrow="STUDENT HEALTH SERVICES" title="Sick leave" description="Create requests and review medical leave certificates." action={<button className="button button-primary" onClick={() => setShowForm(true)} type="button"><span>＋</span> New request</button>} />
      <div className="leave-overview"><span className="leave-overview-icon">▤</span><div><strong>{pending.length} request{pending.length === 1 ? '' : 's'} awaiting review</strong><p>Approved certificates can be printed for the patient.</p></div></div>
      <section className="panel"><div className="panel-heading"><div><h2>Requests to review</h2><p>Review details before approving or declining</p></div></div>{pending.length ? <div className="leave-list">{pending.map((leave) => <LeaveCard key={leave.id} leave={leave} onDecide={decide} />)}</div> : <EmptyState title="Nothing to review" body="New leave requests will appear here." />}</section>
      <section className="panel reviewed-panel"><div className="panel-heading"><div><h2>Reviewed requests</h2><p>Previously approved or declined</p></div></div>{reviewed.length ? <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Reference code</th><th>Approved dates</th><th>Diagnosis</th><th>Status</th><th></th></tr></thead><tbody>{reviewed.map((leave) => <tr key={leave.id}><td><strong>{leave.patientName}</strong></td><td className="muted-cell">{leave.id}</td><td>{leave.from} — {leave.to}</td><td>{leave.diagnosis || leave.reason}</td><td><StatusBadge value={leave.status} /></td><td>{leave.status === 'Approved' && <button className="row-action" onClick={() => { setSelectedCertificateId(leave.id); setCertificate(leave); }} type="button">Preview / print ↗</button>}</td></tr>)}</tbody></table></div> : <EmptyState title="No reviewed requests yet" body="Approved and declined requests will be listed here." />}</section>
      <section className="panel leave-certificate-panel mt-6">
        <div className="panel-heading">
          <div><h2>Medical certificate preview</h2><p>{selectedCertificate?.status === 'Approved' ? 'Approved certificate ready to preview and print.' : 'A certificate preview will be available after a request is approved.'}</p></div>
          {selectedCertificate?.status === 'Approved' && <button className="button button-primary" onClick={() => setCertificate(selectedCertificate)} type="button">Preview / print ↗</button>}
        </div>
        {selectedCertificate
          ? <SickLeaveCertificate leave={selectedCertificate} patient={data.patients.find((patient) => patient.id === selectedCertificate.patientId)} />
          : <EmptyState title="No approved certificates yet" body="Approve a sick leave request to prepare its certificate here." />}
      </section>
      {showForm && (
        <Modal className="leave-request-modal" title="New sick leave request" onClose={() => setShowForm(false)}>
          <div className="leave-request-layout">
            <form className="form-stack leave-request-form" onSubmit={requestLeave}>
              <p className="leave-form-intro">Complete the request details. The certificate preview updates as you type.</p>
              <label>Patient<select name="patientId" required value={selectedPatientId} onChange={(event) => setSelectedPatientId(event.target.value)}><option disabled value="">Select a patient</option>{data.patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>)}</select></label>
              <label>Diagnosis<input name="diagnosis" onChange={(event) => setDiagnosis(event.target.value)} placeholder="Enter the clinical diagnosis" required value={diagnosis} /></label>
              <div className="form-row"><label>From<input min={today()} name="from" onChange={(event) => { const nextStart = event.target.value; setStartsOn(nextStart); if (endsOn < nextStart) setEndsOn(nextStart); }} required type="date" value={startsOn} /></label><label>To<input min={startsOn || today()} name="to" onChange={(event) => setEndsOn(event.target.value)} required type="date" value={endsOn} /></label></div>
              <label>Medical reason / notes<textarea name="reason" onChange={(event) => setReason(event.target.value)} placeholder="Brief supporting details" required rows="3" value={reason} /></label>
              <div className="leave-request-meta"><span>Leave duration</span><strong>{leaveDays > 0 ? `${leaveDays} day${leaveDays === 1 ? '' : 's'}` : 'Choose a valid period'}</strong></div>
              <div className="form-actions"><button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button><button className="button button-primary" type="submit">Submit request</button></div>
            </form>
            <div className="leave-preview-column"><div className="leave-preview-heading"><span>LIVE PREVIEW</span><small>Demo certificate · not official</small></div><SickLeaveCertificate leave={previewLeave} patient={selectedPatient} preview /></div>
          </div>
        </Modal>
      )}
      {certificate && (
        <Modal className="certificate-modal" backdropClassName="certificate-modal-backdrop" title="Sick leave certificate" onClose={() => setCertificate(null)}>
          <SickLeaveCertificate leave={certificate} patient={data.patients.find((patient) => patient.id === certificate.patientId)} />
          <div className="form-actions certificate-print-actions"><button className="button button-quiet" onClick={() => setCertificate(null)} type="button">Close</button><button className="button button-primary" onClick={() => window.print()} type="button">Print certificate</button></div>
        </Modal>
      )}
    </>
  );
}

function calculateLeaveDays(from, to) {
  if (!validDateRange(from, to)) return 0;
  return Math.floor((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000) + 1;
}

function validDateRange(from, to) {
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }
  return validDate(from) && validDate(to) && to >= from;
}

function SickLeaveCertificate({ leave, patient, preview = false }) {
  const from = leave.from || leave.startsOn || '';
  const to = leave.to || leave.endsOn || '';
  const patientName = patient?.name || leave.patientName || 'Patient name';
  const patientId = patient?.id || leave.patientId || 'Patient ID';
  const diagnosis = leave.diagnosis || leave.reason || 'Diagnosis will appear here';
  const dateLabel = (value) => value
    ? new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`))
    : '—';
  const issueDate = leave.created || leave.createdAt?.slice(0, 10) || today();
  return (
    <article className={`certificate-sheet ${preview ? 'certificate-preview' : ''}`}>
      <div className="certificate-watermark">DEMO</div>
      <header className="certificate-header">
        <span className="certificate-brand-mark" aria-hidden="true">MA</span>
        <div><strong>MEKDELA AMBA UNIVERSITY</strong><span>Student &amp; Staff Health Directorate</span></div>
      </header>
      <div className="certificate-rule" />
      <div className="certificate-title-block"><span>STUDENT HEALTH SERVICES</span><h3>SICK LEAVE CERTIFICATE</h3><small>Certificate no. {leave.id || '—'}</small></div>
      <p className="certificate-intro">This is to certify that the following patient was assessed by the University Clinic:</p>
      <div className="certificate-fields">
        <div><span>Patient name</span><strong>{patientName}</strong></div>
        <div><span>Patient ID</span><strong>{patientId}</strong></div>
        <div><span>Age / Sex</span><strong>{patient ? `${patient.age} years / ${patient.sex}` : '—'}</strong></div>
        <div><span>Issue date</span><strong>{dateLabel(issueDate)}</strong></div>
        <div className="certificate-field-wide"><span>Diagnosis</span><strong>{diagnosis}</strong></div>
        <div className="certificate-field-wide"><span>Medical notes</span><strong>{leave.reason || '—'}</strong></div>
        <div><span>Leave begins</span><strong>{dateLabel(from)}</strong></div>
        <div><span>Leave ends</span><strong>{dateLabel(to)}</strong></div>
      </div>
      <div className="certificate-duration"><span>{leave.status === 'Approved' ? 'APPROVED REST PERIOD' : 'REQUESTED REST PERIOD'}</span><strong>{calculateLeaveDays(from, to) || '—'} <small>day{calculateLeaveDays(from, to) === 1 ? '' : 's'}</small></strong></div>
      <p className="certificate-statement">The patient is advised to rest during the period stated above. This document is a demonstration preview and is not an official medical certificate.</p>
      <footer className="certificate-signatures"><div><span className="signature-line" /><strong>Clinic Medical Officer</strong><small>Authorized health professional</small></div><div className="certificate-seal"><span>UNIVERSITY<br />CLINIC</span><small>SEAL</small></div></footer>
      <div className="certificate-status"><span>Status</span><strong>{preview ? 'PREVIEW · PENDING' : leave.status.toUpperCase()}</strong></div>
    </article>
  );
}

function LeaveCard({ leave, onDecide }) {
  return <article className="leave-card"><div className="leave-person"><span className="avatar table-avatar">{leave.patientName.slice(0, 1)}</span><div><strong>{leave.patientName}</strong><small>{leave.id} · Submitted {leave.created}</small></div></div><div className="leave-dates"><small>REQUESTED PERIOD · {calculateLeaveDays(leave.from, leave.to)} DAYS</small><strong>{leave.from} <span>→</span> {leave.to}</strong></div><div className="leave-reason"><small>DIAGNOSIS</small><span>{leave.diagnosis || leave.reason}</span></div><div className="leave-actions"><button className="button button-quiet button-danger" onClick={() => onDecide(leave.id, 'Declined')} type="button">Decline</button><button className="button button-primary" onClick={() => onDecide(leave.id, 'Approved')} type="button">Approve</button></div></article>;
}

function PharmacyPage({ data, updateData, notify }) {
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedRx, setSelectedRx] = useState('');
  const [medicineToRemove, setMedicineToRemove] = useState(null);
  const available = data.prescriptions.filter((prescription) => prescription.status === 'Ready');
  const stock = data.inventory.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase()));
  function addMedicine(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const medicine = { id: makeId('M'), name: form.get('name').trim(), category: form.get('category').trim(), quantity: Number(form.get('quantity')), reorder: Number(form.get('reorder')), expiry: form.get('expiry') };
    updateData((current) => ({ ...current, inventory: [medicine, ...current.inventory] }));
    setShowAdd(false);
    notify(`${medicine.name} added to inventory.`);
  }
  function removeMedicine() {
    if (!medicineToRemove) return;
    const hasReadyPrescription = data.prescriptions.some(
      (prescription) => prescription.status === 'Ready'
        && prescription.medicine.toLowerCase() === medicineToRemove.name.toLowerCase(),
    );
    if (hasReadyPrescription) {
      notify('This medicine is linked to a ready prescription and cannot be removed yet.');
      setMedicineToRemove(null);
      return;
    }
    updateData((current) => ({
      ...current,
      inventory: current.inventory.filter((item) => item.id !== medicineToRemove.id),
    }));
    notify(`${medicineToRemove.name} removed from inventory.`);
    setMedicineToRemove(null);
  }
  function dispense(event) {
    event.preventDefault();
    const prescription = data.prescriptions.find((item) => item.id === selectedRx);
    if (!prescription) return;
    const medicine = data.inventory.find((item) => item.name.toLowerCase() === prescription.medicine.toLowerCase());
    if (!medicine) { notify('This medicine is not in the inventory. Add or restock it before dispensing.'); return; }
    if (medicine.quantity < 1) { notify('This item is out of stock. Restock it before dispensing.'); return; }
    updateData((current) => ({
      ...current,
      inventory: current.inventory.map((item) => item.id === medicine.id ? { ...item, quantity: item.quantity - 1 } : item),
      prescriptions: current.prescriptions.map((item) => item.id === prescription.id ? { ...item, status: 'Dispensed', dispensed: today() } : item),
    }));
    setSelectedRx('');
    notify(`Dispensed ${prescription.medicine} for ${prescription.patientName}.`);
  }
  return (
    <>
      <PageHeading eyebrow="MEDICINE & SUPPLIES" title="Pharmacy" description="Track medicine stock and fulfill prescriptions from consultations." action={<button className="button button-primary" onClick={() => setShowAdd(true)} type="button"><span>＋</span> Add medicine</button>} />
      <div className="pharmacy-stats"><div className="mini-stat"><span>Total items</span><strong>{data.inventory.length}</strong></div><div className="mini-stat"><span>Units in stock</span><strong>{data.inventory.reduce((sum, item) => sum + item.quantity, 0)}</strong></div><div className="mini-stat"><span>Low stock</span><strong className={data.inventory.some((item) => item.quantity <= item.reorder) ? 'warning-text' : ''}>{data.inventory.filter((item) => item.quantity <= item.reorder).length}</strong></div><div className="mini-stat"><span>Ready prescriptions</span><strong>{available.length}</strong></div></div>
      <section className="panel dispense-panel"><div className="panel-heading"><div><h2>Dispense prescription</h2><p>Dispensing reduces the matching inventory by one unit.</p></div></div><form className="dispense-form" onSubmit={dispense}><label className="search-box"><span aria-hidden="true">Rx</span><select aria-label="Choose prescription" onChange={(event) => setSelectedRx(event.target.value)} required value={selectedRx}><option value="">Select a ready prescription</option>{available.map((rx) => <option key={rx.id} value={rx.id}>{rx.patientName} — {rx.medicine} ({rx.instructions || 'No instructions'})</option>)}</select></label><button className="button button-primary" disabled={!available.length} type="submit">Dispense medicine <span>→</span></button></form>{!available.length && <p className="form-hint">No prescriptions are waiting. Add one from the Consultations workspace.</p>}</section>
      <section className="panel"><div className="panel-heading"><div><h2>Medicine inventory</h2><p>Monitor quantities and expiry dates</p></div></div><div className="toolbar"><label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Search inventory" onChange={(event) => setQuery(event.target.value)} placeholder="Search medicine or category" value={query} /></label><span className="result-count">{stock.length} items</span></div><div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Category</th><th>In stock</th><th>Reorder at</th><th>Expiry date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{stock.map((item) => <tr key={item.id}><td><span className="medicine-icon">Rx</span><strong>{item.name}</strong></td><td>{item.category}</td><td><strong>{item.quantity}</strong> units</td><td>{item.reorder} units</td><td>{item.expiry}</td><td><StatusBadge value={item.quantity <= item.reorder ? 'Low stock' : 'In stock'} /></td><td><button aria-label={`Remove ${item.name} from inventory`} className="row-action inventory-remove" onClick={() => setMedicineToRemove(item)} type="button">Remove</button></td></tr>)}</tbody></table>{!stock.length && <EmptyState title="No medicines found" body="Try another search term." />}</div></section>
      <section className="panel prescription-history"><div className="panel-heading"><div><h2>Recent prescriptions</h2><p>Medication orders recorded during consultations</p></div></div>{data.prescriptions.length ? <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Medication</th><th>Instructions</th><th>Date</th><th>Status</th></tr></thead><tbody>{data.prescriptions.map((rx) => <tr key={rx.id}><td><strong>{rx.patientName}</strong></td><td>{rx.medicine}</td><td>{rx.instructions || '—'}</td><td>{rx.date}</td><td><StatusBadge value={rx.status} /></td></tr>)}</tbody></table></div> : <EmptyState title="No prescriptions yet" body="Prescriptions saved in consultations will appear here." />}</section>
      {showAdd && <Modal title="Add medicine to inventory" onClose={() => setShowAdd(false)}><form className="form-stack" onSubmit={addMedicine}><label>Medicine name<input autoFocus name="name" placeholder="e.g. Paracetamol 500 mg" required /></label><label>Category<input name="category" placeholder="e.g. Pain relief" required /></label><div className="form-row"><label>Quantity<input min="0" name="quantity" required type="number" /></label><label>Reorder level<input min="0" name="reorder" required type="number" /></label></div><label>Expiry date<input min={today()} name="expiry" required type="date" /></label><div className="form-actions"><button className="button button-quiet" onClick={() => setShowAdd(false)} type="button">Cancel</button><button className="button button-primary" type="submit">Save medicine</button></div></form></Modal>}
      {medicineToRemove && <Modal title="Remove medicine?" onClose={() => setMedicineToRemove(null)}><p className="confirm-copy">Remove {medicineToRemove.name} from the inventory? This cannot be undone.</p><div className="form-actions"><button className="button button-quiet" onClick={() => setMedicineToRemove(null)} type="button">Cancel</button><button className="button button-danger" onClick={removeMedicine} type="button">Remove medicine</button></div></Modal>}
    </>
  );
}

function PaymentsPage({ data, updateData, notify }) {
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const payments = data.payments;
  const getStatus = (payment) => payment.status || 'Paid';
  const totalRevenue = payments
    .filter((payment) => getStatus(payment) === 'Paid')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const pendingTotal = payments
    .filter((payment) => getStatus(payment) === 'Pending')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const waivedTotal = payments
    .filter((payment) => getStatus(payment) === 'Waived')
    .reduce((sum, payment) => sum + Number(payment.amount), 0);
  const filteredPayments = payments.filter((payment) => (
    (statusFilter === 'All' || getStatus(payment) === statusFilter)
      && `${payment.id} ${payment.patientName} ${payment.studentId || payment.patientId} ${payment.reference || ''} ${payment.service}`
        .toLowerCase()
        .includes(query.toLowerCase())
  ));
  const tabCounts = {
    All: payments.length,
    Paid: payments.filter((payment) => getStatus(payment) === 'Paid').length,
    Pending: payments.filter((payment) => getStatus(payment) === 'Pending').length,
    Waived: payments.filter((payment) => getStatus(payment) === 'Waived').length,
  };

  function createInvoice(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const patient = data.patients.find((item) => item.id === form.get('patientId'));
    const amount = Number(form.get('amount'));
    const studentId = String(form.get('studentId') || '').trim();
    const service = String(form.get('service') || '');
    const method = String(form.get('method') || '');
    const status = String(form.get('status') || '');
    if (!patient || !studentId || !Number.isFinite(amount) || amount <= 0 || !service || !method
      || !['Paid', 'Pending', 'Waived'].includes(status)) {
      notify('Enter a patient, student ID, valid amount, service, payment method, and invoice status.');
      return;
    }

    const invoice = {
      id: makeId('INV'),
      patientId: patient.id,
      patientName: patient.name,
      studentId,
      amount,
      service,
      method,
      status,
      date: today(),
      reference: String(form.get('reference') || '').trim(),
    };
    updateData((current) => ({ ...current, payments: [invoice, ...current.payments] }));
    setShowForm(false);
    notify(`Invoice ${invoice.id} created for ${patient.name}.`);
  }

  return (
    <>
      <PageHeading eyebrow="FINANCE & RECEIPTS" title="Payments & Billing" description="Manage patient invoices, payment methods, and student coverage." action={<button className="button button-primary" disabled={!data.patients.length} onClick={() => setShowForm(true)} type="button"><span aria-hidden="true">＋</span> New Invoice</button>} />
      <div className="billing-summary">
        <article className="billing-summary-card"><span className="billing-summary-icon revenue"><CircleDollarSign aria-hidden="true" size={20} /></span><span className="billing-summary-label">Total Revenue</span><strong>{formatETB(totalRevenue)}</strong><small>Paid invoices</small></article>
        <article className="billing-summary-card"><span className="billing-summary-icon pending"><Clock3 aria-hidden="true" size={20} /></span><span className="billing-summary-label">Pending Payments</span><strong>{formatETB(pendingTotal)}</strong><small>Awaiting payment</small></article>
        <article className="billing-summary-card"><span className="billing-summary-icon completed"><BadgeCheck aria-hidden="true" size={20} /></span><span className="billing-summary-label">Completed Invoices</span><strong>{tabCounts.Paid}</strong><small>Successfully paid</small></article>
        <article className="billing-summary-card"><span className="billing-summary-icon waived"><ShieldCheck aria-hidden="true" size={20} /></span><span className="billing-summary-label">Student Waived Coverage</span><strong>{formatETB(waivedTotal)}</strong><small>Covered by student waiver</small></article>
      </div>
      <section className="panel">
        <div className="billing-toolbar">
          <div className="billing-tabs" aria-label="Filter invoices by status" role="group">
            {['All', 'Paid', 'Pending', 'Waived'].map((status) => (
              <button aria-pressed={statusFilter === status} className={`billing-tab ${statusFilter === status ? 'active' : ''}`} key={status} onClick={() => setStatusFilter(status)} type="button">
                {status}<span>{tabCounts[status]}</span>
              </button>
            ))}
          </div>
          <label className="billing-search"><Search aria-hidden="true" size={17} /><input aria-label="Search invoices" onChange={(event) => setQuery(event.target.value)} placeholder="Search patient or student ID" value={query} /></label>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient Name</th><th>Student ID</th><th>Service / Treatment</th><th>Amount</th><th>Payment Method</th><th>Status</th></tr></thead>
            <tbody>{filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td><strong>{payment.patientName}</strong><br /><span className="muted-cell">{payment.id}</span></td>
                <td>{payment.studentId || payment.patientId}</td>
                <td>{payment.service}</td>
                <td><strong>{formatETB(Number(payment.amount))}</strong></td>
                <td>{payment.method === 'Bank transfer' ? 'CBE Birr' : payment.method}</td>
                <td><StatusBadge value={getStatus(payment)} /></td>
              </tr>
            ))}</tbody>
          </table>
          {filteredPayments.length === 0 && <EmptyState title={query || statusFilter !== 'All' ? 'No invoices found' : 'No invoices yet'} body={query || statusFilter !== 'All' ? 'Try a different search or status filter.' : 'Create a new invoice to get started.'} />}
        </div>
        {!data.patients.length && <p className="form-hint">Add a patient before creating an invoice.</p>}
      </section>
      {showForm && (
        <Modal title="Create a new invoice" onClose={() => setShowForm(false)}>
          <form className="form-stack" onSubmit={createInvoice}>
            <label>Patient<select autoFocus defaultValue="" name="patientId" required><option disabled value="">Select a patient</option>{data.patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>)}</select></label>
            <label>Student ID<input autoComplete="off" name="studentId" placeholder="Enter student ID" required /></label>
            <label>Service / treatment<input name="service" placeholder="e.g. Consultation, laboratory test" required /></label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label>Amount (ETB)<input min="0.01" name="amount" placeholder="0.00" required step="0.01" type="number" /></label>
              <label>Payment method<select defaultValue="" name="method" required><option disabled value="">Select a method</option><option>CBE Birr</option><option>Telebirr</option><option>Cash</option><option>Insurance</option></select></label>
            </div>
            <label>Invoice status<select defaultValue="Pending" name="status" required><option>Paid</option><option>Pending</option><option>Waived</option></select></label>
            <label>Reference <span className="muted-cell">(optional)</span><input autoComplete="off" name="reference" placeholder="Receipt or transaction reference" /></label>
            <p className="patient-form-note"><span aria-hidden="true">i</span> Demo invoice only. No payment is processed or transferred.</p>
            <div className="form-actions"><button className="button button-quiet" onClick={() => setShowForm(false)} type="button">Cancel</button><button className="button button-primary" type="submit">Create Invoice</button></div>
          </form>
        </Modal>
      )}
    </>
  );
}

function formatETB(amount) {
  return `ETB ${new Intl.NumberFormat('en-ET', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)}`;
}

function PatientRows({ patients, selectedId, onSelect }) {
  return <div className="patient-rows">{patients.map((patient, index) => <button className={`patient-row ${selectedId === patient.id ? 'selected' : ''}`} key={patient.id} onClick={() => onSelect?.(patient.id)} type="button"><span className={`avatar queue-avatar avatar-tone-${index % 4}`}>{patient.name.slice(0, 1)}</span><span className="patient-row-info"><strong>{patient.name}</strong><small>{patient.id} · {patient.age} years</small></span><StatusBadge value={patient.status} /><span className="row-chevron">›</span></button>)}</div>;
}

function StatusBadge({ value }) {
  const normalized = value.toLowerCase().replaceAll(' ', '-');
  return <span className={`badge badge-${normalized}`}>{value}</span>;
}

function EmptyState({ title, body }) {
  return <div className="empty-state"><span className="empty-icon">⌕</span><strong>{title}</strong><p>{body}</p></div>;
}

function Modal({ title, onClose, children, className = '', backdropClassName = '' }) {
  useEffect(() => {
    function onKeyDown(event) { if (event.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  return <div className={`modal-backdrop ${backdropClassName}`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section aria-labelledby="modal-title" aria-modal="true" className={`modal-card ${className}`} role="dialog"><div className="modal-heading"><h2 id="modal-title">{title}</h2><button aria-label="Close dialog" className="icon-button" onClick={onClose} type="button">×</button></div>{children}</section></div>;
}

export default App;
=======
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard/cardroom" element={<CardRoomDashboard />} />
      <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
      <Route path="/dashboard/pharmacy" element={<PharmacyDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
>>>>>>> 32f5318cdff4a74bf04a36a8c71e3f6b99b917e4
