import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const PW_REG = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

// One component for Login, Register and the OTP step
export default function AuthForm({ mode }) {
  const { login, register, verifyOtp, resendOtp } = useAuth();
  const nav = useNavigate();
  const isReg = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [masked, setMasked] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  // live validation: the button stays disabled until everything is valid
  const emailOk = EMAIL_RE.test(form.email.trim());
  const pwOk = isReg ? PW_REG.test(form.password) : form.password.length >= 6;
  const nameOk = !isReg || form.name.trim().length >= 2;
  const valid = emailOk && pwOk && nameOk;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const data = isReg ? await register(form) : await login(form.email.trim(), form.password);
      setMasked(data.email); setStep('otp'); setCooldown(30);
    } catch (err) { setError(err.response?.data?.message || 'Request failed'); }
  };
  const verify = async (e) => {
    e.preventDefault(); setError('');
    try {
      const user = await verifyOtp(form.email.trim(), otp);
      nav(user.role === 'alumni' ? '/alumni-dashboard' : '/directory');
    } catch (err) { setError(err.response?.data?.message || 'Verification failed'); }
  };
  const resend = async () => {
    setError('');
    try { await resendOtp(form.email.trim()); setCooldown(30); } catch (err) { setError(err.response?.data?.message || 'Could not resend'); }
  };

  const input = 'w-full border rounded-lg px-4 py-2';
  const hint = (show, text) => show && <p className="text-xs text-red-600 -mt-2">{text}</p>;

  if (step === 'otp')
    return (
      <form onSubmit={verify} className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow space-y-4">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-gray-600">We sent a 6-digit code to <b>{masked}</b>. It is valid for 5 minutes.</p>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className={`${input} text-center text-2xl tracking-[0.4em] font-bold`} inputMode="numeric" maxLength={6} placeholder="------"
          value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus />
        <button disabled={otp.length !== 6} className="w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-40">Verify and continue</button>
        <div className="flex justify-between text-sm">
          <button type="button" onClick={resend} disabled={cooldown > 0} className="text-indigo-600 disabled:text-gray-400">
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
          <button type="button" onClick={() => { setStep('form'); setOtp(''); setError(''); }} className="text-gray-500">Use a different account</button>
        </div>
        <p className="text-xs text-gray-400">No SMTP set up? In dev mode the code is printed in the server terminal.</p>
      </form>
    );

  return (
    <form onSubmit={submit} noValidate className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow space-y-4">
      <h1 className="text-2xl font-bold">{isReg ? 'Create your account' : 'Welcome back'}</h1>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {isReg && <input className={input} placeholder="Full name" value={form.name} onChange={set('name')} />}
      {hint(isReg && form.name && !nameOk, 'Enter your full name')}
      <input className={input} placeholder="Email (name@example.com)" value={form.email} onChange={set('email')} autoComplete="email" />
      {hint(form.email && !emailOk, 'Enter a valid email like name@example.com')}
      <input className={input} type="password" placeholder={isReg ? 'Password (8+ chars, letter and number)' : 'Password'} value={form.password} onChange={set('password')} />
      {hint(form.password && !pwOk, isReg ? 'Use 8+ characters with a letter and a number' : 'At least 6 characters')}
      {isReg && (
        <div className="flex gap-3">
          {['student', 'alumni'].map((r) => (
            <label key={r} className={`flex-1 text-center border rounded-lg py-2 cursor-pointer capitalize ${form.role === r ? 'bg-indigo-600 text-white' : ''}`}>
              <input type="radio" className="hidden" name="role" value={r} checked={form.role === r} onChange={set('role')} />{r}
            </label>
          ))}
        </div>
      )}
      <button disabled={!valid} className="w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-40">{isReg ? 'Register' : 'Log in'}</button>
      <p className="text-sm text-center text-gray-500">
        {isReg ? <>Have an account? <Link className="text-indigo-600" to="/login">Login</Link></> : <>New here? <Link className="text-indigo-600" to="/register">Register</Link></>}
      </p>
    </form>
  );
}
