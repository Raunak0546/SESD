import { useEffect, useState } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';

export default function StudentDashboard() {
  const [requests, setRequests] = useState([]);

  // poll every 15s so status badges update without a refresh
  useEffect(() => {
    const load = () => api.get('/referrals/my-requests').then((r) => setRequests(r.data));
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Referral Requests</h1>
      {requests.length === 0 && <p className="text-gray-500">No requests yet. Find an alumnus in the directory and send one.</p>}
      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r._id} className="bg-white border rounded-xl p-4 flex justify-between items-start gap-4">
            <div>
              <p className="font-semibold">{r.alumni?.name}{r.job && <span className="font-normal text-gray-500"> · {r.job.title} at {r.job.company}</span>}</p>
              <p className="text-sm text-gray-600 mt-1">{r.message}</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <StatusBadge status={r.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
