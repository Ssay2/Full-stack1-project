import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from './Login';

export default function Signup() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const { signup, error, loading } = useAuth(); const navigate = useNavigate();
  async function handleSubmit(event) { event.preventDefault(); if (await signup(email, password)) navigate('/dashboard'); }
  return <AuthLayout eyebrow="A clearer beginning" title="Make room for what matters." subtitle="Create your account and bring your financial picture into focus."><form className="auth-form" onSubmit={handleSubmit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required placeholder="At least 8 characters" /></label>{error && <p className="error">{error}</p>}<button className="primary-button" type="submit" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button></form><p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p></AuthLayout>;
}