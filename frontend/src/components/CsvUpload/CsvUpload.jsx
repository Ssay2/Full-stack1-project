import { useRef, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function CsvUpload({ onImported }) {
  const inputRef = useRef(null); const { token } = useAuth(); const [status, setStatus] = useState('');
  async function handleChange(event) { const file = event.target.files[0]; if (!file) return; setStatus('Importing...'); try { const result = await api.importCsv(token, file); setStatus(`${result.imported} transactions added`); onImported(); } catch (error) { setStatus(error.message); } event.target.value = ''; }
  return <div className="upload-box"><div><span className="upload-icon">+</span><strong>Bring in your history</strong><p>Drop a CSV here or choose a file to import transactions.</p></div><button className="button button-light" onClick={() => inputRef.current.click()}>Choose CSV</button><input ref={inputRef} type="file" accept=".csv,text/csv" hidden onChange={handleChange} />{status && <small className="upload-status">{status}</small>}</div>;
}