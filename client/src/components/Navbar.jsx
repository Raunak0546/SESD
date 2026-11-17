import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <nav className="bg-indigo-700 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/directory" className="font-bold text-lg">Alumnest</Link>
      <div className="flex items-center gap-5 text-sm">
        {user ? (
          <>
            <Link to="/directory">Directory</Link>
            <Link to="/jobs">Jobs</Link>
            {user.role === 'student' && <Link to="/student">My Requests</Link>}
            {user.role === 'alumni' && <Link to="/alumni-dashboard">Dashboard</Link>}
            <span className="opacity-80">{user.name} ({user.role})</span>
            <button onClick={() => { logout(); nav('/login'); }} className="bg-white/20 px-3 py-1 rounded">Logout</button>
          </>
        ) : (<><Link to="/login">Login</Link><Link to="/register">Register</Link></>)}
      </div>
    </nav>
  );
}
