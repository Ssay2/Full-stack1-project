import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { AuthPage } from './Login';

export default function Signup({ onLogin }) { const { saveSession } = useAuth(); const [form, setForm] = useState({ name: '', email: '', password: '' }); const [error, setError] = useState(''); const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  async function submit(event) { event.preventDefault(); try { saveSession(await api.signup(form)); } catch (requestError) { setError(requestError.message); } }
  return <AuthPage title="Create your account" subtitle="A calm, clear home for your financial life." onSubmit={submit} error={error} fields={<><label>Your name<input value={form.name} onChange={update('name')} required placeholder="Alex Morgan" /></label><label>Email<input type="email" value={form.email} onChange={update('email')} required placeholder="you@example.com" /></label><label>Password<input type="password" value={form.password} onChange={update('password')} required minLength="8" placeholder="8+ characters" /></label></>} button="Create account"><p className="switch-copy">Already have an account? <button type="button" onClick={onLogin}>Sign in</button></p></AuthPage>; }