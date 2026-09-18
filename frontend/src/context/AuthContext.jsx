import { createContext, useContext, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(false); const [error, setError] = useState(null);
  async function authenticate(path, email, password) { setLoading(true); setError(null); try { const { data } = await client.post(path, { email, password }); localStorage.setItem('token', data.token); setUser(data.user); return true; } catch (requestError) { setError(requestError.response?.data?.error || 'Request failed'); return false; } finally { setLoading(false); } }
  function logout() { localStorage.removeItem('token'); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, error, signup: (email, password) => authenticate('/auth/signup', email, password), login: (email, password) => authenticate('/auth/login', email, password), logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);