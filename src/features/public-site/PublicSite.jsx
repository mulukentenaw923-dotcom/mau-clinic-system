import { useEffect, useState } from 'react';
import { ArrowRight, Clock3, MapPin, Phone, ShieldPlus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { readApiResponse } from '../../services/api.js';
import './public-site.css';

const campuses = ['Main Campus', 'Tulu Awulya', 'Ginba'];

const services = [
  ['Reception and patient registration', 'Identity lookup and registration for students, staff, and visitors.'],
  ['Triage and vital signs', 'Initial assessment, vital signs recording, and priority routing.'],
  ['Medical consultation and e-prescriptions', 'Clinical assessment, diagnosis, treatment plans, and digital prescriptions.'],
  ['Laboratory diagnostics', 'Diagnostic tests coordinated with clinic laboratory staff.'],
  ['Pharmacy dispensing and expiry tracking', 'Prescription fulfillment and batch-level medicine stock monitoring.'],
  ['Emergency and priority care', 'Urgent assessment and priority handling by clinic staff.'],
  ['Student medical certificates', 'Clinician-reviewed sick-leave documentation for eligible students.'],
];

const pageTitles = {
  '/about': 'About the clinic',
  '/services': 'Clinic services',
  '/contact': 'Contact the clinic',
};

export default function PublicSite() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const { pathname: path } = useLocation();
  const pageTitle = pageTitles[path];

  useEffect(() => {
    if (path !== '/') return undefined;
    const controller = new AbortController();
    fetch('/api/v1/public/summary', { signal: controller.signal })
      .then(async (response) => {
        const result = await readApiResponse(response);
        if (!response.ok) throw new Error(result.error || 'Clinic statistics are unavailable.');
        return result;
      })
      .then(setSummary)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setSummary(null);
      });
    return () => controller.abort();
  }, [path]);

  async function submitContact(event) {
    event.preventDefault();
    setError('');
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch('/api/v1/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await readApiResponse(response);
      if (!response.ok) throw new Error(result.error || 'Unable to send your message.');
      setSubmitted(true);
      form.reset();
    } catch (requestError) {
      setError(requestError.message || 'Unable to send your message. Please try again later.');
    }
  }

  return (
    <div className="public-site">
      <header className="public-header">
        <Link className="public-brand" to="/" aria-label="MAU Clinic home">
          <span className="public-brand-mark"><ShieldPlus size={23} strokeWidth={1.8} /></span>
          <span><strong>MAU Clinic</strong><small>MEKDELA AMBA UNIVERSITY</small></span>
        </Link>
        <nav className="public-nav" aria-label="Public navigation">
          <Link aria-current={path === '/' ? 'page' : undefined} to="/">Home</Link>
          <Link aria-current={path === '/about' ? 'page' : undefined} to="/about">About</Link>
          <Link aria-current={path === '/services' ? 'page' : undefined} to="/services">Services</Link>
          <Link aria-current={path === '/contact' ? 'page' : undefined} to="/contact">Contact</Link>
        </nav>
        <Link className="public-staff-link" to="/login">Staff sign in <ArrowRight size={15} /></Link>
      </header>

      {path === '/contact' ? (
        <main className="public-contact-page">
          <div className="public-page-heading">
            <p className="public-eyebrow">WE ARE HERE TO HELP</p>
            <h1>{pageTitle}</h1>
            <p>Send a non-urgent question to the MAU Clinic team. Do not include private medical details.</p>
          </div>
          <div className="public-contact-layout">
            <aside className="public-contact-aside">
              <h2>Campus clinics</h2>
              <p>Choose the campus your message concerns. For urgent medical needs, contact the nearest clinic directly.</p>
              {campuses.map((campus) => <div className="public-contact-campus" key={campus}><MapPin size={17} /><span>{campus}</span></div>)}
              <div className="public-contact-note"><Phone size={17} /><span>{import.meta.env.VITE_PUBLIC_HOTLINE ? <a href={`tel:${import.meta.env.VITE_PUBLIC_HOTLINE}`}>{import.meta.env.VITE_PUBLIC_HOTLINE}</a> : 'Emergency hotline details await campus confirmation.'}</span></div>
              {import.meta.env.VITE_PUBLIC_EMAIL && <div className="public-contact-campus"><span aria-hidden="true">@</span><a href={`mailto:${import.meta.env.VITE_PUBLIC_EMAIL}`}>{import.meta.env.VITE_PUBLIC_EMAIL}</a></div>}
              {import.meta.env.VITE_PUBLIC_HOURS && <div className="public-contact-campus"><Clock3 size={17} /><span>{import.meta.env.VITE_PUBLIC_HOURS}</span></div>}
              <p className="public-map-note">Campus map references and clinic addresses will be published after verification.</p>
            </aside>
            <form className="public-contact-form" onSubmit={submitContact}>
              <div className="public-form-grid">
                <label>Full name<input autoComplete="name" maxLength="120" name="fullName" required /></label>
                <label>Student / staff ID <span className="public-optional">Optional</span><input maxLength="80" name="universityId" /></label>
                <label>Email address<input autoComplete="email" maxLength="254" name="email" required type="email" /></label>
                <label>Campus<select name="campus" required defaultValue=""><option disabled value="">Select campus</option>{campuses.map((campus) => <option key={campus}>{campus}</option>)}</select></label>
              </div>
              <label>Subject<input maxLength="160" name="subject" required /></label>
              <label>Message<textarea maxLength="3000" name="message" required rows="5" /></label>
              {error && <p className="public-form-error" role="alert">{error}</p>}
              {submitted && <p className="public-form-success" role="status">Your message was received. Thank you for contacting the clinic.</p>}
              <button className="public-button public-button-primary" type="submit">Send message <ArrowRight size={16} /></button>
            </form>
          </div>
        </main>
      ) : path === '/about' ? (
        <main className="public-inner-page">
          <p className="public-eyebrow">CARE FOR OUR UNIVERSITY COMMUNITY</p>
          <h1>{pageTitle}</h1>
          <p className="public-lead">The Mekdela Amba University Clinic supports the health and wellbeing of students, staff, and visitors across the university's campuses.</p>
          <div className="public-about-band">
            <div><span className="public-section-label">OUR MISSION</span><h2>Accessible, respectful campus care</h2><p>Provide coordinated primary care, timely assessment, and appropriate referrals for the MAU community.</p></div>
            <div><span className="public-section-label">OUR VISION</span><h2>A healthier university community</h2><p>Support wellbeing and learning through dependable, accessible campus health services.</p></div>
          </div>
          <section className="public-values-team"><div><span className="public-section-label">OUR VALUES</span><h2>Care with trust and purpose.</h2><p>Patient care · Confidentiality · Efficiency</p></div><div><span className="public-section-label">OUR TEAM</span><h2>Care delivered by clinic professionals.</h2><p>Doctors and health officers · Nurses · Pharmacists · ICT administrators</p></div></section>
          <Link className="public-inline-link" to="/services">Explore clinic services <ArrowRight size={16} /></Link>
        </main>
      ) : path === '/services' ? (
        <main className="public-inner-page">
          <p className="public-eyebrow">HOW WE CAN HELP</p>
          <h1>{pageTitle}</h1>
          <p className="public-lead">Services are provided by clinic staff according to campus availability and clinical need.</p>
          <div className="public-service-list">{services.map(([title, description], index) => <article className="public-service-row" key={title}><span className="public-service-number">0{index + 1}</span><div><h2>{title}</h2><p>{description}</p></div><ArrowRight aria-hidden="true" size={18} /></article>)}</div>
          <Link className="public-inline-link" to="/contact">Ask about a service <ArrowRight size={16} /></Link>
        </main>
      ) : (
        <main>
          <section className="public-hero">
            <img className="public-hero-image" src="/clinic-campus.png" alt="Mekdela Amba University campus" />
            <div className="public-hero-overlay" />
            <div className="public-hero-content">
              <p className="public-eyebrow">MEKDELA AMBA UNIVERSITY · CAMPUS HEALTH</p>
              <h1>Care for the people who move us forward.</h1>
              <p>Accessible clinic services for students, staff, and visitors at Main Campus, Tulu Awulya, and Ginba.</p>
              <div className="public-hero-actions"><Link className="public-button public-button-light" to="/portal">Check queue <ArrowRight size={16} /></Link><Link className="public-hero-secondary" to="/contact">Ask about registration / appointments</Link></div>
            </div>
            <span className="public-hero-caption">Mekdela Amba University</span>
          </section>
          <section className="public-emergency-banner"><Phone size={19} /><div><strong>Need urgent care?</strong><span>{import.meta.env.VITE_PUBLIC_HOTLINE ? `Call ${import.meta.env.VITE_PUBLIC_HOTLINE}` : 'Official emergency contact details are awaiting campus confirmation.'}</span></div>{import.meta.env.VITE_PUBLIC_HOTLINE && <a href={`tel:${import.meta.env.VITE_PUBLIC_HOTLINE}`}>Call clinic</a>}</section>
          <section className="public-quick-stats" aria-label="Clinic statistics">
            <div><span>Patients served today</span><strong>{summary?.dailyPatientsServed ?? '—'}</strong></div>
            <div><span>Active doctors</span><strong>{summary?.activeDoctors ?? '—'}</strong></div>
            <div><span>Available medicines</span><strong>{summary?.availableMedicines ?? '—'}</strong></div>
            <small>{summary ? `Updated ${new Date(summary.updatedAt).toLocaleTimeString()}` : 'Live statistics unavailable'}</small>
          </section>
          <section className="public-status-section" aria-labelledby="campus-status-heading">
            <div className="public-status-heading"><span className="public-section-label">CAMPUS LOCATIONS</span><h2 id="campus-status-heading">Clinic status</h2><p>Live operating status is not connected yet. Please confirm availability with your campus clinic.</p></div>
            <div className="public-status-list">{campuses.map((campus) => <div className="public-status-item" key={campus}><MapPin size={18} /><strong>{campus}</strong><span><i /> Status unavailable</span></div>)}</div>
          </section>
          <section className="public-hours-band"><Clock3 size={21} /><div><strong>Clinic hours</strong><span>Hours vary by campus. Contact your clinic to confirm today's schedule.</span></div><Link to="/contact">Get in touch <ArrowRight size={15} /></Link></section>
          <section className="public-home-services"><div><span className="public-section-label">SUPPORT THROUGHOUT YOUR VISIT</span><h2>Care, from first contact to follow-up.</h2></div><div className="public-service-teaser">{services.slice(0, 3).map(([title]) => <Link to="/services" key={title}>{title}<ArrowRight size={16} /></Link>)}</div></section>
        </main>
      )}

      <footer className="public-footer"><Link className="public-brand" to="/"><span className="public-brand-mark"><ShieldPlus size={21} /></span><span><strong>MAU Clinic</strong><small>MEKDELA AMBA UNIVERSITY</small></span></Link><span>Clinic information for the university community</span><Link to="/login">Staff portal</Link><Link to="/portal">Patient portal</Link></footer>
    </div>
  );
}