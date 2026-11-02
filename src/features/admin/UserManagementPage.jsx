import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { apiRequest } from '../../services/api.js';

const ROLES = [
  ['receptionist', 'Receptionist'],
  ['triage_nurse', 'Triage nurse'],
  ['doctor', 'Doctor / health officer'],
  ['pharmacist', 'Pharmacist'],
  ['super_admin', 'Super Admin'],
];

const EMPTY_FORM = {
  name: '',
  email: '',
  staffId: '',
  role: 'receptionist',
  password: '',
};

export default function UserManagementPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [createdUser, setCreatedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
    setCreatedUser(null);
  }

  async function submit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setCreatedUser(null);
    try {
      const result = await apiRequest('auth/register', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          staffId: form.staffId.trim(),
        }),
      });
      setCreatedUser(result.user);
      setForm(EMPTY_FORM);
    } catch (requestError) {
      setError(requestError.message || 'Account could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="admin-user-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">SYSTEM ADMINISTRATION</div>
          <h1>User management</h1>
          <p>Create staff accounts and assign least-privilege roles.</p>
        </div>
      </div>
      <section className="admin-user-panel" aria-labelledby="create-user-heading">
        <div className="admin-user-panel-heading">
          <span className="admin-user-icon"><UserPlus aria-hidden="true" size={19} /></span>
          <div><h2 id="create-user-heading">Create account</h2><p>Only Super Admins can provision clinic staff accounts.</p></div>
        </div>
        <form className="admin-user-form" onSubmit={submit}>
          <label>Full name<input autoComplete="name" maxLength="120" name="name" onChange={updateField} required value={form.name} /></label>
          <label>Work email<input autoComplete="email" maxLength="254" name="email" onChange={updateField} required type="email" value={form.email} /></label>
          <label><span>MAU staff ID <span className="admin-user-optional">Optional</span></span><input maxLength="80" name="staffId" onChange={updateField} value={form.staffId} /></label>
          <label>Role<select name="role" onChange={updateField} value={form.role}>{ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="admin-user-password">Temporary password<input autoComplete="new-password" maxLength="72" minLength="12" name="password" onChange={updateField} required type="password" value={form.password} /><small>Use 12–72 characters. Share credentials through an approved secure channel.</small></label>
          {error && <p className="admin-user-error" role="alert">{error}</p>}
          {createdUser && <p className="admin-user-success" role="status">Account created for {createdUser.email} with the {createdUser.role} role.</p>}
          <button className="button button-primary admin-user-submit" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating account...' : 'Create account'}</button>
        </form>
      </section>
    </div>
  );
}