import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './styles.css';

export default function App() { const { isAuthenticated } = useAuth(); const [page, setPage] = useState('login'); if (isAuthenticated) return <Dashboard />; return page === 'login' ? <Login onSignup={() => setPage('signup')} /> : <Signup onLogin={() => setPage('login')} />; }