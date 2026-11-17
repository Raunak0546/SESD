import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobBoard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => { api.get('/jobs').then((r) => setJobs(r.data)); }, []);

  const askReferral = async (job) => {
    const message = window.prompt(`Why should ${job.postedBy.name} refer you for "${job.title}"?`);
    if (!message) return;
    try { await api.post('/referrals', { alumniId: job.postedBy._id, jobId: job._id, message }); setNote('Referral request sent. Track it under My Requests.'); }
    catch (err) { setNote(err.response?.data?.message || 'Could not send request'); }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Job & Referral Board</h1>
      {note && <p className="text-sm bg-indigo-50 text-indigo-700 p-2 rounded mb-4">{note}</p>}
      {jobs.length === 0 && <p className="text-gray-500">No jobs posted yet.</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white border rounded-xl p-5 flex flex-col">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            <p className="text-indigo-700 text-sm">{job.company}</p>
            <p className="text-sm text-gray-600 my-3 flex-1">{job.description}</p>
            <p className="text-xs text-gray-400 mb-3">Posted by {job.postedBy?.name}</p>
            <div className="flex gap-2">
              <a href={job.applyLink} target="_blank" rel="noreferrer" className="flex-1 text-center border rounded-lg py-2 text-sm">Apply</a>
              {user.role === 'student' && <button onClick={() => askReferral(job)} className="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm">Ask referral</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
