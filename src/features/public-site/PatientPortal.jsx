import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowRight, Clock3, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { readApiResponse } from '../../services/api.js';
import './public-site.css';

const campuses = ['Main Campus', 'Tulu Awulya', 'Ginba'];

export default function PatientPortal() {
  const [universityId, setUniversityId] = useState('');
  const [campus, setCampus] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [queue, setQueue] = useState(null);
  const [queueError, setQueueError] = useState('');
  const [certificateError, setCertificateError] = useState('');
  const [queueLookup, setQueueLookup] = useState(null);
  const [isCheckingQueue, setIsCheckingQueue] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!queueLookup) return undefined;
    const controller = new AbortController();
    const refreshQueue = async () => {
      const query = new URLSearchParams(queueLookup);
      try {
        const response = await fetch(`/api/v1/public/queue?${query}`, { signal: controller.signal });
        const result = await readApiResponse(response);
        if (!response.ok) throw new Error(result.error || 'Queue status is unavailable.');
        setQueue(result);
        setQueueError('');
      } catch (error) {
        if (error.name !== 'AbortError') setQueueError(error.message || 'Queue status is unavailable.');
      }
    };
    const timer = window.setInterval(refreshQueue, 60000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [queueLookup]);

  async function checkQueue(event) {
    event.preventDefault();
    setQueueError('');
    setQueue(null);
    setIsCheckingQueue(true);
    const lookup = { universityId: universityId.trim(), campus };
    const query = new URLSearchParams(lookup);
    try {
      const response = await fetch(`/api/v1/public/queue?${query}`);
      const result = await readApiResponse(response);
      if (!response.ok) throw new Error(result.error || 'Queue status is unavailable.');
      setQueue(result);
      setQueueLookup(lookup);
    } catch (error) {
      setQueueError(error.message || 'Queue status is unavailable.');
    } finally {
      setIsCheckingQueue(false);
    }
  }

  async function downloadCertificate(event) {
    event.preventDefault();
    setCertificateError('');
    setIsDownloading(true);
    try {
      const response = await fetch('/api/v1/public/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/pdf, application/json' },
        body: JSON.stringify({ universityId: universityId.trim(), verificationCode }),
      });
      if (!response.ok) {
        const result = await readApiResponse(response);
        throw new Error(result.error || 'Certificate could not be downloaded.');
      }
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadUrl;
      downloadLink.download = 'MAU-medical-certificate.pdf';
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setCertificateError(error.message || 'Certificate could not be downloaded.');
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="public-site">
      <header className="public-header">
        <Link className="public-brand" to="/"><span className="public-brand-mark"><ShieldCheck size={22} /></span><span><strong>MAU Clinic</strong><small>MEKDELA AMBA UNIVERSITY</small></span></Link>
        <nav className="public-nav" aria-label="Public navigation">
          <Link to="/">Home</Link><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/contact">Contact</Link>
        </nav>
        <Link className="public-staff-link" to="/login">Staff sign in <ArrowRight size={15} /></Link>
      </header>
      <main className="portal-page">
        <div className="public-page-heading">
          <p className="public-eyebrow">MAU STUDENT & STAFF SERVICES</p>
          <h1>Patient portal</h1>
          <p>Check today’s clinic queue or retrieve an approved certificate using your MAU ID and the verification code provided by clinic staff.</p>
        </div>
        <div className="portal-columns">
          <section className="portal-panel" aria-labelledby="queue-heading">
            <div className="portal-panel-heading"><Clock3 size={20} /><div><span className="public-section-label">TODAY</span><h2 id="queue-heading">Live queue</h2></div></div>
            <form className="portal-form" onSubmit={checkQueue}>
              <label>MAU ID<input autoComplete="username" maxLength="80" onChange={(event) => setUniversityId(event.target.value)} required value={universityId} /></label>
              <label>Campus<select onChange={(event) => setCampus(event.target.value)} required value={campus}><option disabled value="">Select campus</option>{campuses.map((location) => <option key={location}>{location}</option>)}</select></label>
              {queueError && <p className="public-form-error" role="alert">{queueError}</p>}
              <button className="public-button public-button-primary" disabled={isCheckingQueue} type="submit">{isCheckingQueue ? 'Checking...' : 'Check queue'} <ArrowRight size={16} /></button>
            </form>
            {queue && <div className="portal-queue-result" role="status"><span>YOUR QUEUE NUMBER</span><strong>{queue.queueNumber}</strong><p>{queue.status === 'completed' ? 'Visit completed' : `Position ${queue.position} · ${queue.status.replaceAll('_', ' ')}`}</p></div>}
          </section>
          <section className="portal-panel" aria-labelledby="certificate-heading">
            <div className="portal-panel-heading"><ArrowDownToLine size={20} /><div><span className="public-section-label">APPROVED DOCUMENTS</span><h2 id="certificate-heading">Medical certificate</h2></div></div>
            <form className="portal-form" onSubmit={downloadCertificate}>
              <label>MAU ID<input autoComplete="username" maxLength="80" onChange={(event) => setUniversityId(event.target.value)} required value={universityId} /></label>
              <label>Verification code<input autoComplete="one-time-code" maxLength="100" onChange={(event) => setVerificationCode(event.target.value)} required value={verificationCode} /></label>
              {certificateError && <p className="public-form-error" role="alert">{certificateError}</p>}
              <button className="public-button public-button-primary" disabled={isDownloading} type="submit">{isDownloading ? 'Preparing...' : 'Download certificate'} <ArrowDownToLine size={16} /></button>
            </form>
          </section>
        </div>
        <p className="portal-privacy-note"><ShieldCheck size={16} /> Queue lookup returns only queue number and position. Never share your certificate verification code.</p>
      </main>
      <footer className="public-footer"><Link className="public-brand" to="/"><span className="public-brand-mark"><ShieldCheck size={21} /></span><span><strong>MAU Clinic</strong><small>MEKDELA AMBA UNIVERSITY</small></span></Link><span>For urgent needs, contact the nearest campus clinic directly.</span><Link to="/contact">Contact</Link></footer>
    </div>
  );
}