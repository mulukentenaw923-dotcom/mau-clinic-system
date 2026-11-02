import { useState } from 'react';
import { Briefcase, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';

export default function RegisterPage({ onRegister, onSignIn }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Doctor');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function submit(event) {
    event.preventDefault();
    onRegister({ fullName: fullName.trim(), email: email.trim(), role });
  }

  return (
    <div className="signin-card">
      <h1>Create an account</h1>
      <p className="login-copy">Mekdela Amba University Clinic Management System</p>
      <form className="form-stack" onSubmit={submit}>
        <label htmlFor="register-name">Full name
          <span className="input-wrap">
            <User aria-hidden="true" className="field-icon" size={18} />
            <input autoComplete="name" id="register-name" onChange={(event) => setFullName(event.target.value)} placeholder="Abebe Kebede" required value={fullName} />
          </span>
        </label>
        <label htmlFor="register-email">Email address
          <span className="input-wrap">
            <Mail aria-hidden="true" className="field-icon" size={18} />
            <input autoComplete="email" id="register-email" onChange={(event) => setEmail(event.target.value)} placeholder="name@university.edu" required type="email" value={email} />
          </span>
        </label>
        <label htmlFor="register-role">Select role
          <span className="input-wrap">
            <Briefcase aria-hidden="true" className="field-icon" size={18} />
            <select className="register-role-select" id="register-role" onChange={(event) => setRole(event.target.value)} value={role}>
              <option value="Doctor">Doctor</option>
              <option value="Pharmacist">Pharmacist</option>
              <option value="Admin">Administrator</option>
              <option value="Patient">Patient (Student)</option>
            </select>
          </span>
        </label>
        <div className="password-field">
          <label htmlFor="register-password">Password</label>
          <span className="input-wrap">
            <Lock aria-hidden="true" className="field-icon" size={18} />
            <input autoComplete="new-password" id="register-password" minLength="8" onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" required type={showPassword ? 'text' : 'password'} value={password} />
            <button
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="password-visibility"
              onClick={() => setShowPassword((visible) => !visible)}
              type="button"
            >
              {showPassword ? <EyeOff aria-hidden="true" size={18} /> : <Eye aria-hidden="true" size={18} />}
            </button>
          </span>
        </div>
        <button className="welcome-button login-submit" type="submit">Create account</button>
      </form>
      <p className="account-prompt">
        Already have an account?{' '}
        <button className="account-toggle" onClick={onSignIn} type="button">Sign in</button>
      </p>
      <p className="privacy-note"><span aria-hidden="true">ⓘ</span> Demo only. Account details are not saved or verified.</p>
    </div>
  );
}
