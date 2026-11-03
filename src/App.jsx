import { useState } from 'react';

const departments = [
  { id: 'admin', name: 'Admin', description: 'Manage staff oversight, generate operational reports, configure security settings, and supervise clinic workflows.', mark: 'AD', accent: 'linear-gradient(135deg, #0891b2, #0369a1)' },
  { id: 'cardroom', name: 'Card Room', description: 'Register patients, create medical history cards, archive files, and search existing records.', mark: 'CR', accent: 'linear-gradient(135deg, #10b981, #047857)' },
  { id: 'emergency', name: 'Emergency Room', description: 'Handle urgent admissions, critical triage, immediate care assignments, and emergency transfers.', mark: 'ER', accent: 'linear-gradient(135deg, #f43f5e, #be123c)' },
  { id: 'pharmacy', name: 'Pharmacy', description: 'Review prescriptions, dispense medications, monitor stock balances, and track expiration dates.', mark: 'PH', accent: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
  { id: 'laboratory', name: 'Laboratory', description: 'Process diagnostic test orders, track specimens, record findings, and publish results.', mark: 'LB', accent: 'linear-gradient(135deg, #f59e0b, #b45309)' },
  { id: 'doctor', name: 'Doctor', description: 'Review patient queues, record diagnoses, order laboratory tests, and prescribe medication.', mark: 'DR', accent: 'linear-gradient(135deg, #06b6d4, #0e7490)' },
];

const publicPages = ['Home', 'About Us', 'Services', 'Contact'];

const styles = {
  root: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 75% -10%, #123a38 0%, #0c2027 38%, #09121d 78%)',
    color: '#edf5f2',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  navbar: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    minHeight: 76,
    padding: '12px clamp(18px, 5vw, 64px)',
    borderBottom: '1px solid rgba(166, 204, 194, 0.13)',
    background: 'rgba(7, 17, 26, 0.9)',
  },
  logoContainer: { display: 'flex', minWidth: 0, alignItems: 'center', gap: 11 },
  logoBadge: {
    display: 'grid',
    width: 42,
    height: 42,
    flex: '0 0 42px',
    placeItems: 'center',
    borderRadius: 10,
    background: '#0d7568',
    color: '#eafff8',
    fontSize: 13,
    fontWeight: 800,
  },
  logoText: { overflow: 'hidden', color: '#f1f7f4', fontSize: 14, fontWeight: 700, textOverflow: 'ellipsis' },
  navLinks: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 },
  navLink: {
    minHeight: 38,
    padding: '0 11px',
    border: '1px solid transparent',
    borderRadius: 7,
    background: 'transparent',
    color: '#afc3c0',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
  },
  activeNavLink: {
    minHeight: 38,
    padding: '0 11px',
    border: '1px solid rgba(84, 208, 177, 0.26)',
    borderRadius: 7,
    background: 'rgba(13, 117, 104, 0.2)',
    color: '#8ee2c9',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
  },
  loginNavButton: {
    minHeight: 38,
    marginLeft: 5,
    padding: '0 16px',
    border: '1px solid #178b79',
    borderRadius: 7,
    background: '#0d7568',
    color: '#f2fffb',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
  },
  logoutNavButton: {
    minHeight: 38,
    marginLeft: 5,
    padding: '0 14px',
    border: '1px solid rgba(255, 164, 143, 0.35)',
    borderRadius: 7,
    background: 'rgba(138, 54, 48, 0.22)',
    color: '#ffd0c7',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 700,
  },
  main: { width: 'min(1120px, 100%)', minHeight: 'calc(100vh - 138px)', margin: '0 auto', padding: '44px clamp(18px, 5vw, 64px) 60px' },
  eyebrow: { color: '#75cdb4', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' },
  hero: {
    position: 'relative',
    display: 'flex',
    minHeight: 'min(520px, 62vh)',
    alignItems: 'center',
    overflow: 'hidden',
    padding: '56px clamp(22px, 7vw, 80px)',
    border: '1px solid rgba(166, 204, 194, 0.14)',
    borderRadius: 14,
    backgroundColor: '#153c39',
    backgroundImage: 'linear-gradient(90deg, rgba(5, 23, 24, 0.92), rgba(5, 23, 24, 0.63) 55%, rgba(5, 23, 24, 0.12)), url("/mekdela-campus.jpg")',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  },
  heroText: { position: 'relative', zIndex: 1, maxWidth: 630 },
  heroTitle: { margin: '15px 0 14px', color: '#f4fbf7', fontSize: 'clamp(34px, 6vw, 58px)', fontWeight: 700, lineHeight: 1.08 },
  heroSubtitle: { maxWidth: 550, margin: 0, color: '#c4d6d1', fontSize: 16, lineHeight: 1.7 },
  primaryButton: {
    minHeight: 46,
    marginTop: 24,
    padding: '0 18px',
    border: '1px solid #36a991',
    borderRadius: 7,
    background: '#0d7568',
    color: '#f2fffb',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
  },
  pageHeading: { margin: '0 0 12px', color: '#f1f8f5', fontSize: 32, lineHeight: 1.2 },
  pageCopy: { maxWidth: 760, margin: 0, color: '#b5c8c3', fontSize: 15, lineHeight: 1.8 },
  pageIntro: { marginBottom: 28 },
  serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 230px), 1fr))', gap: 12, marginTop: 26 },
  serviceCard: { minHeight: 146, padding: 18, border: '1px solid rgba(166, 204, 194, 0.15)', borderRadius: 9, background: 'rgba(13, 29, 38, 0.82)' },
  serviceMark: { color: '#5fd2af', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em' },
  serviceTitle: { margin: '12px 0 6px', color: '#edf6f2', fontSize: 17 },
  serviceCopy: { margin: 0, color: '#a8bfba', fontSize: 13, lineHeight: 1.6 },
  contactList: { display: 'grid', maxWidth: 720, gap: 0, marginTop: 30, borderTop: '1px solid rgba(166, 204, 194, 0.16)' },
  contactRow: { display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: 18, padding: '17px 0', borderBottom: '1px solid rgba(166, 204, 194, 0.16)' },
  contactLabel: { color: '#87a29b', fontSize: 13 },
  contactValue: { color: '#e6f1ed', fontSize: 14, lineHeight: 1.6 },
  loginWrap: { display: 'grid', minHeight: 'calc(100vh - 180px)', placeItems: 'center' },
  loginCard: { width: 'min(460px, 100%)', padding: 'clamp(22px, 5vw, 34px)', border: '1px solid rgba(166, 204, 194, 0.16)', borderRadius: 13, background: 'rgba(11, 25, 34, 0.94)', boxShadow: '0 24px 70px rgba(0, 0, 0, 0.28)' },
  loginMark: { display: 'grid', width: 48, height: 48, margin: '0 auto 16px', placeItems: 'center', borderRadius: 12, background: '#0d7568', color: '#eafff8', fontWeight: 800 },
  loginTitle: { margin: 0, color: '#f1f8f5', fontSize: 24, textAlign: 'center' },
  loginSubtitle: { margin: '8px 0 24px', color: '#a8bfba', fontSize: 13, textAlign: 'center' },
  form: { display: 'grid', gap: 15 },
  label: { display: 'grid', gap: 7, color: '#d3e2dd', fontSize: 13, fontWeight: 600 },
  input: { width: '100%', minHeight: 44, padding: '10px 12px', border: '1px solid rgba(166, 204, 194, 0.23)', borderRadius: 7, outline: 'none', background: '#0a1721', color: '#f3faf7', fontSize: 14 },
  error: { margin: 0, padding: '10px 12px', border: '1px solid rgba(255, 130, 120, 0.35)', borderRadius: 7, background: 'rgba(126, 43, 40, 0.2)', color: '#ffc6bf', fontSize: 13 },
  dashboardHeader: { display: 'flex', flexWrap: 'wrap', alignItems: 'end', justifyContent: 'space-between', gap: 14, marginBottom: 28 },
  dashboardTitle: { margin: '8px 0 0', color: '#f1f8f5', fontSize: 30 },
  userPill: { padding: '8px 11px', border: '1px solid rgba(166, 204, 194, 0.16)', borderRadius: 7, background: 'rgba(13, 29, 38, 0.8)', color: '#b9cec8', fontSize: 12 },
  departmentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 22 },
  departmentButton: { display: 'flex', minHeight: 260, minWidth: 0, flexDirection: 'column', alignItems: 'stretch', padding: 26, border: '1px solid rgba(166, 204, 194, 0.17)', borderRadius: 13, background: 'linear-gradient(145deg, rgba(17, 35, 44, 0.98), rgba(11, 25, 34, 0.88))', color: '#edf5f2', cursor: 'pointer', textAlign: 'left', boxShadow: '0 16px 34px rgba(0, 0, 0, 0.2)' },
  departmentCardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  departmentMark: { display: 'grid', width: 50, height: 50, placeItems: 'center', borderRadius: 12, color: '#fff', fontSize: 13, fontWeight: 800, boxShadow: '0 8px 18px rgba(0, 0, 0, 0.25)' },
  departmentName: { display: 'block', margin: '2px 0 10px', color: '#f2f8f5', fontSize: 21, fontWeight: 700 },
  departmentCopy: { display: 'block', maxWidth: 470, color: '#a8bfba', fontSize: 14, lineHeight: 1.7 },
  departmentArrow: { color: '#70cbb0', fontSize: 22 },
  departmentCardFooter: { marginTop: 'auto', paddingTop: 18, borderTop: '1px solid rgba(166, 204, 194, 0.13)', color: '#79d9be', fontSize: 12, fontWeight: 700 },
  backButton: { minHeight: 38, marginBottom: 22, padding: '0 12px', border: '1px solid rgba(166, 204, 194, 0.2)', borderRadius: 7, background: 'rgba(13, 29, 38, 0.8)', color: '#c5d8d2', cursor: 'pointer', fontSize: 13, fontWeight: 600 },
  workspacePanel: { padding: 'clamp(20px, 4vw, 32px)', border: '1px solid rgba(166, 204, 194, 0.16)', borderRadius: 11, background: 'rgba(13, 29, 38, 0.86)' },
  workspaceMark: { display: 'grid', width: 50, height: 50, marginBottom: 16, placeItems: 'center', borderRadius: 11, background: 'rgba(13, 117, 104, 0.22)', color: '#79d9be', fontSize: 13, fontWeight: 800 },
  workspaceTitle: { margin: '0 0 8px', color: '#f2f8f5', fontSize: 26 },
  workspaceCopy: { maxWidth: 700, margin: 0, color: '#adc2bc', fontSize: 14, lineHeight: 1.7 },
  workspaceTools: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))', gap: 10, marginTop: 24 },
  toolItem: { minHeight: 68, padding: '14px 15px', border: '1px solid rgba(166, 204, 194, 0.13)', borderRadius: 8, background: 'rgba(7, 17, 26, 0.62)', color: '#c6d9d3', fontSize: 13, fontWeight: 600 },
  footer: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8, padding: '16px clamp(18px, 5vw, 64px)', borderTop: '1px solid rgba(166, 204, 194, 0.12)', color: '#819a94', fontSize: 11 },
};

const workspaceTools = {
  admin: ['Staff accounts', 'Clinic reports', 'System activity', 'Department settings'],
  cardroom: ['Register patient', 'Find medical record', 'Issue queue number', 'Patient history'],
  emergency: ['Triage queue', 'Urgent admissions', 'Emergency cases', 'Care handover'],
  pharmacy: ['Prescription queue', 'Dispense medicine', 'Inventory levels', 'Reorder watch'],
  laboratory: ['New test orders', 'Work in progress', 'Record results', 'Result history'],
  doctor: ['Patient queue', 'Consultation notes', 'Diagnosis records', 'Prescriptions'],
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  function showPage(page) {
    setCurrentPage(page);
    setError('');
  }

  function handleLogin(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Enter your email address and password to continue.');
      return;
    }
    setError('');
    setIsLoggedIn(true);
    setSelectedDepartment(null);
    setCurrentPage('Departments');
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setSelectedDepartment(null);
    setEmail('');
    setPassword('');
    setError('');
    setCurrentPage('Login');
  }

  function renderPublicPage() {
    if (currentPage === 'Home') {
      return (
        <section style={styles.hero}>
          <div style={styles.heroText}>
            <span style={styles.eyebrow}>Mekdela Amba University Clinic</span>
            <h1 style={styles.heroTitle}>Care for our campus community.</h1>
            <p style={styles.heroSubtitle}>A connected digital platform for patient services, clinical teams, and campus healthcare operations.</p>
            <button onClick={() => showPage('Login')} style={styles.primaryButton} type="button">Access clinic system</button>
          </div>
        </section>
      );
    }

    if (currentPage === 'About Us') {
      return (
        <section style={styles.pageIntro}>
          <span style={styles.eyebrow}>About the clinic</span>
          <h1 style={styles.pageHeading}>Connected care for the university community.</h1>
          <p style={styles.pageCopy}>The Mekdela Amba University Clinic Management System connects patient services, emergency response, clinicians, pharmacy, laboratory, and administration through coordinated digital workflows.</p>
        </section>
      );
    }

    if (currentPage === 'Services') {
      return (
        <section>
          <div style={styles.pageIntro}>
            <span style={styles.eyebrow}>Clinic operations</span>
            <h1 style={styles.pageHeading}>Departments and services</h1>
            <p style={styles.pageCopy}>Choose a department workspace after signing in to access its clinic tools.</p>
          </div>
          <div style={styles.serviceGrid}>
            {departments.map((department) => (
              <article key={department.id} style={styles.serviceCard}>
                <span style={styles.serviceMark}>{department.mark}</span>
                <h2 style={styles.serviceTitle}>{department.name}</h2>
                <p style={styles.serviceCopy}>{department.description}.</p>
              </article>
            ))}
          </div>
        </section>
      );
    }

    return (
      <section>
        <div style={styles.pageIntro}>
          <span style={styles.eyebrow}>Contact and support</span>
          <h1 style={styles.pageHeading}>Contact the clinic team.</h1>
          <p style={styles.pageCopy}>For campus healthcare support or system access, reach the Mekdela Amba University Clinic.</p>
        </div>
        <div style={styles.contactList}>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Location</span><strong style={styles.contactValue}>Mekdela Amba University Main Campus, Amhara Region, Ethiopia</strong></div>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Email</span><a href="mailto:clinic.support@mau.edu.et" style={styles.contactValue}>clinic.support@mau.edu.et</a></div>
          <div style={styles.contactRow}><span style={styles.contactLabel}>Phone</span><a href="tel:+251331112222" style={styles.contactValue}>+251 33 111 2222</a></div>
        </div>
      </section>
    );
  }

  function renderLogin() {
    return (
      <section style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <div style={styles.loginMark}>MAU</div>
          <h1 style={styles.loginTitle}>System Login</h1>
          <p style={styles.loginSubtitle}>Enter your credentials to continue.</p>
          <form onSubmit={handleLogin} style={styles.form}>
            <label style={styles.label}>
              Email Address
              <input autoComplete="username" onChange={(event) => setEmail(event.target.value)} placeholder="user@mau.edu.et" required style={styles.input} type="email" value={email} />
            </label>
            <label style={styles.label}>
              Password
              <input autoComplete="current-password" onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required style={styles.input} type="password" value={password} />
            </label>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            <button style={styles.primaryButton} type="submit">Sign In</button>
          </form>
        </div>
      </section>
    );
  }

  function renderDepartments() {
    return (
      <section>
        <div style={styles.dashboardHeader}>
          <div>
            <span style={styles.eyebrow}>Clinic workspace</span>
            <h1 style={styles.dashboardTitle}>Choose a department</h1>
          </div>
          <span style={styles.userPill}>{email}</span>
        </div>
        <div style={styles.departmentGrid}>
          {departments.map((department) => (
            <button
              key={department.id}
              onClick={() => {
                setSelectedDepartment(department);
                setCurrentPage('Workspace');
              }}
              style={styles.departmentButton}
              type="button"
            >
              <span style={styles.departmentCardHeader}>
                <span style={{ ...styles.departmentMark, background: department.accent }}>{department.mark}</span>
                <span aria-hidden="true" style={styles.departmentArrow}>→</span>
              </span>
              <span style={{ display: 'block' }}>
                <strong style={styles.departmentName}>{department.name}</strong>
                <span style={styles.departmentCopy}>{department.description}</span>
              </span>
              <span style={styles.departmentCardFooter}>Open Workspace</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  function renderWorkspace() {
    return (
      <section>
        <button
          onClick={() => {
            setSelectedDepartment(null);
            setCurrentPage('Departments');
          }}
          style={styles.backButton}
          type="button"
        >
          ← Back to Departments
        </button>
        <div style={styles.workspacePanel}>
          <div style={styles.workspaceMark}>{selectedDepartment.mark}</div>
          <span style={styles.eyebrow}>Department workspace</span>
          <h1 style={styles.workspaceTitle}>{selectedDepartment.name}</h1>
          <p style={styles.workspaceCopy}>{selectedDepartment.description}. Use the workspace tools below to continue clinic operations.</p>
          <div style={styles.workspaceTools}>
            {workspaceTools[selectedDepartment.id].map((tool) => <div key={tool} style={styles.toolItem}>{tool}</div>)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div style={styles.root}>
      <header style={styles.navbar}>
        <div style={styles.logoContainer}>
          <div style={styles.logoBadge}>MAU</div>
          <span style={styles.logoText}>Mekdela Amba University Clinic</span>
        </div>
        <nav aria-label="Main navigation" style={styles.navLinks}>
          {publicPages.map((page) => (
            <button key={page} onClick={() => showPage(page)} style={currentPage === page ? styles.activeNavLink : styles.navLink} type="button">{page}</button>
          ))}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => {
                  setSelectedDepartment(null);
                  showPage('Departments');
                }}
                style={currentPage === 'Departments' ? styles.activeNavLink : styles.navLink}
                type="button"
              >
                Departments
              </button>
              <button onClick={handleLogout} style={styles.logoutNavButton} type="button">Logout</button>
            </>
          ) : (
            <button onClick={() => showPage('Login')} style={styles.loginNavButton} type="button">Login</button>
          )}
        </nav>
      </header>

      <main style={styles.main}>
        {currentPage === 'Login' && !isLoggedIn && renderLogin()}
        {currentPage === 'Departments' && isLoggedIn && renderDepartments()}
        {currentPage === 'Workspace' && isLoggedIn && selectedDepartment && renderWorkspace()}
        {publicPages.includes(currentPage) && renderPublicPage()}
      </main>

      <footer style={styles.footer}>
        <strong>MAU Clinic</strong>
        <span>Mekdela Amba University · Amhara Region, Ethiopia</span>
      </footer>
    </div>
  );
}