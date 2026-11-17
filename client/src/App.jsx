import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AlumniDirectory from './pages/AlumniDirectory';
import StudentDashboard from './pages/StudentDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import JobBoard from './pages/JobBoard';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/directory" element={<ProtectedRoute><AlumniDirectory /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobBoard /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/alumni-dashboard" element={<ProtectedRoute roles={['alumni']}><AlumniDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/directory" />} />
      </Routes>
    </>
  );
}
