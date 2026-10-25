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

  return (
    <div className="app-shell">
      <aside className="sidebar">
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
      </main>
    </div>
  );
}

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
    </div>
  );
}

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
