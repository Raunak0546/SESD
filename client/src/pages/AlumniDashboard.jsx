import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

const box = 'w-full border rounded-lg px-3 py-2 text-sm';

export default function AlumniDashboard() {
  const [inbox, setInbox] = useState([]);
  const [profile, setProfile] = useState({ graduationYear: '', department: '', currentCompany: '', jobTitle: '', skills: '', linkedinUrl: '', bio: '' });
  const [job, setJob] = useState({ title: '', company: '', description: '', applyLink: '' });
  const [msg, setMsg] = useState('');

  const loadInbox = () => api.get('/referrals/received').then((r) => setInbox(r.data));
  useEffect(() => {
    loadInbox();
    api.get('/alumni/me').then((r) => r.data && setProfile({ ...r.data, skills: r.data.skills.join(', ') }));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await api.post('/alumni/profile', { ...profile, graduationYear: Number(profile.graduationYear), skills: profile.skills.split(',').map((s) => s.trim()).filter(Boolean) });
      setMsg('Profile saved');
    } catch (err) { setMsg(err.response?.data?.message || 'Could not save profile'); }
  };
  const postJob = async (e) => {
    e.preventDefault();
    try { await api.post('/jobs', job); setJob({ title: '', company: '', description: '', applyLink: '' }); setMsg('Job posted'); }
    catch (err) { setMsg(err.response?.data?.message || 'Could not post job'); }
  };
  const decide = async (id, status) => { await api.patch(`/referrals/${id}/status`, { status }); loadInbox(); };
  const p = (k) => ({ value: profile[k] ?? '', onChange: (e) => setProfile({ ...profile, [k]: e.target.value }) });
  const j = (k) => ({ value: job[k], onChange: (e) => setJob({ ...job, [k]: e.target.value }), required: true });

  return (
    <div className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      {msg && <p className="md:col-span-2 text-sm bg-indigo-50 text-indigo-700 p-2 rounded">{msg}</p>}

      <form onSubmit={saveProfile} className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-bold text-lg">My alumni profile</h2>
        <input className={box} placeholder="Graduation year" type="number" required {...p('graduationYear')} />
        <input className={box} placeholder="Department" required {...p('department')} />
        <input className={box} placeholder="Current company" required {...p('currentCompany')} />
        <input className={box} placeholder="Job title" required {...p('jobTitle')} />
        <input className={box} placeholder="Skills (comma separated)" {...p('skills')} />
        <input className={box} placeholder="LinkedIn URL" {...p('linkedinUrl')} />
        <textarea className={box} rows={3} placeholder="Short bio" {...p('bio')} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Save profile</button>
      </form>

      <form onSubmit={postJob} className="bg-white border rounded-xl p-5 space-y-3 self-start">
        <h2 className="font-bold text-lg">Post a job</h2>
        <input className={box} placeholder="Title" {...j('title')} />
        <input className={box} placeholder="Company" {...j('company')} />
        <textarea className={box} rows={3} placeholder="Description" {...j('description')} />
        <input className={box} placeholder="Apply link" {...j('applyLink')} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Post job</button>
      </form>

      <div className="md:col-span-2 bg-white border rounded-xl p-5">
        <h2 className="font-bold text-lg mb-3">Referral requests received</h2>
        {inbox.length === 0 && <p className="text-gray-500 text-sm">Nothing yet.</p>}
        {inbox.map((r) => (
          <div key={r._id} className="border-t py-3 flex justify-between gap-4">
            <div>
              <p className="font-semibold">{r.student?.name} <span className="font-normal text-gray-500 text-sm">{r.student?.email}</span></p>
              <p className="text-sm text-gray-600">{r.message}</p>
            </div>
            {r.status === 'Pending' ? (
              <div className="flex gap-2 items-start">
                <button onClick={() => decide(r._id, 'Accepted')} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Accept</button>
                <button onClick={() => decide(r._id, 'Rejected')} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Reject</button>
              </div>
            ) : <StatusBadge status={r.status} />}
          </div>
        ))}
      </div>
    </div>
  );
}
