import { useEffect, useState } from 'react';
import api from '../api/axios';
import useDebounce from '../hooks/useDebounce';
import AlumniCard from '../components/AlumniCard';
import AlumniModal from '../components/AlumniModal';

export default function AlumniDirectory() {
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('');
  const [year, setYear] = useState('');
  const [options, setOptions] = useState({ companies: [], years: [] });
  const [alumni, setAlumni] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const debouncedSearch = useDebounce(search); // API fires 400ms after typing stops

  useEffect(() => { api.get('/alumni/filters').then((r) => setOptions(r.data)); }, []);
  useEffect(() => { setPage(1); }, [debouncedSearch, company, year]);

  useEffect(() => {
    const controller = new AbortController(); // cancel stale requests
    setLoading(true);
    api.get('/alumni', {
      params: { q: debouncedSearch || undefined, company: company || undefined, year: year || undefined, page },
      signal: controller.signal,
    })
      .then((r) => { setAlumni(r.data.alumni); setPages(r.data.pages); })
      .catch((e) => { if (e.name !== 'CanceledError') console.error(e); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [debouncedSearch, company, year, page]);

  const clear = () => { setSearch(''); setCompany(''); setYear(''); };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Alumni Directory</h1>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, company, role or skill..."
          className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none" />
        <select value={company} onChange={(e) => setCompany(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">All Companies</option>
          {options.companies.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="border rounded-lg px-3 py-2">
          <option value="">All Years</option>
          {options.years.map((y) => <option key={y}>{y}</option>)}
        </select>
        <button onClick={clear} className="px-4 py-2 text-sm text-gray-600 hover:text-indigo-600">Clear</button>
      </div>

      {loading ? <p className="text-gray-500">Loading...</p>
        : alumni.length === 0 ? <p className="text-gray-500">No alumni match. Try clearing a filter.</p>
        : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{alumni.map((a) => <AlumniCard key={a._id} profile={a} onClick={() => setSelected(a)} />)}</div>}

      <div className="flex justify-center items-center gap-4 mt-8">
        <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-4 py-2 border rounded disabled:opacity-40">Prev</button>
        <span className="text-sm">Page {page} of {pages}</span>
        <button disabled={page >= pages} onClick={() => setPage((p) => p + 1)} className="px-4 py-2 border rounded disabled:opacity-40">Next</button>
      </div>
      {selected && <AlumniModal profile={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
