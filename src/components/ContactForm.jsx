import { useState } from 'react';
import { formServices } from '../config/siteConfig';
import { contactApi } from '../api';
import './ContactForm.css';

const empty = { name: '', phone: '', email: '', company: '', service: formServices[0], message: '' };

export default function ContactForm({ onSent }) {
  const [data, setData] = useState(empty);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const change = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await contactApi.submitInquiry({
        ...data,
        type: 'consultation',
      });

      if (result.success) {
        setSent(true);
        setData(empty);
        if (onSent) onSent();
      } else {
        throw new Error(result.message || 'Failed to submit inquiry.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      // If validation errors are returned from backend middleware, display the first specific one
      const specificError = err.errors && err.errors[0]?.message;
      setError(specificError || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="cf" onSubmit={submit}>
      <div className="cf__row">
        <input name="name" placeholder="Your Name" value={data.name} onChange={change} required />
        <input name="phone" type="tel" placeholder="Phone No." value={data.phone} onChange={change} required />
      </div>
      <div className="cf__row">
        <input name="email" type="email" placeholder="Email" value={data.email} onChange={change} required />
        <input name="company" placeholder="Company Name" value={data.company} onChange={change} />
      </div>
      <select name="service" value={data.service} onChange={change}>
        {formServices.map((s) => <option key={s}>{s}</option>)}
      </select>
      <textarea name="message" rows="4" placeholder="Message" value={data.message} onChange={change} />
      <button type="submit" className="btn" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p className="cf__err" style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '8px' }}>{error}</p>}
      {sent && <p className="cf__ok">Thank you! Your inquiry has been saved. We will get back to you soon.</p>}
    </form>
  );
}

