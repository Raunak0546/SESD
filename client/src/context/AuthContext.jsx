import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  const save = ({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };
  // login and register only start the verification: the server emails a 6-digit code
  const login = async (email, password) => (await api.post('/auth/login', { email, password })).data;
  const register = async (form) => (await api.post('/auth/register', form)).data;
  const verifyOtp = async (email, otp) => save((await api.post('/auth/verify-otp', { email, otp })).data);
  const resendOtp = async (email) => (await api.post('/auth/resend-otp', { email })).data;
  const logout = () => { localStorage.clear(); setUser(null); };

  return <AuthContext.Provider value={{ user, login, register, verifyOtp, resendOtp, logout }}>{children}</AuthContext.Provider>;
}
