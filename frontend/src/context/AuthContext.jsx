import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('ledgerly_session') || 'null'));
  function saveSession(next) { localStorage.setItem('ledgerly_session', JSON.stringify(next)); setSession(next); }
  function logout() { localStorage.removeItem('ledgerly_session'); setSession(null); }
  return <AuthContext.Provider value={{ ...session, isAuthenticated: Boolean(session), saveSession, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);