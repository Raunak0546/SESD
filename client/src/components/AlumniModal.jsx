import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function AlumniModal({ profile, onClose }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState('');

  const send = async () => {
    try {
      await api.post('/referrals', { alumniId: profile.user._id, message });
      setFeedback('Referral request sent!'); setMessage('');
    } catch (err) { setFeedback(err.response?.data?.message || 'Something went wrong'); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{profile.user?.name}</h2>
            <p className="text-gray-600">{profile.jobTitle} @ {profile.currentCompany}</p>
            <p className="text-sm text-gray-500">{profile.department} · Class of {profile.graduationYear}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
        </div>
        {profile.bio && <p className="mt-4 text-sm text-gray-700">{profile.bio}</p>}
        <div className="flex flex-wrap gap-2 mt-4">
          {profile.skills.map((s) => <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{s}</span>)}
        </div>
        {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm underline mt-3 inline-block">LinkedIn Profile</a>}

        {user.role === 'student' && (
          <>
            <hr className="my-4" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Introduce yourself and say why you'd like a referral..." className="w-full border rounded-lg p-3 text-sm" />
            <button onClick={send} disabled={!message.trim()} className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-40">Request Referral</button>
            {feedback && <p className="text-sm mt-2 text-center text-gray-600">{feedback}</p>}
          </>
        )}
      </div>
    </div>
  );
}
