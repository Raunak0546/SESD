export default function AlumniCard({ profile, onClick }) {
  const name = profile.user?.name || profile.fullName;
  return (
    <div onClick={onClick} className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer p-5 border">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">{name.charAt(0)}</div>
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-sm text-gray-500">Class of {profile.graduationYear} · {profile.department}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700 mb-3">{profile.jobTitle} @ <b>{profile.currentCompany}</b></p>
      <div className="flex flex-wrap gap-2">
        {profile.skills.slice(0, 4).map((s) => <span key={s} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{s}</span>)}
      </div>
    </div>
  );
}
