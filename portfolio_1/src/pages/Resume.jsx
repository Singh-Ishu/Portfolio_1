import { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';

export default function Resume() {
  const [role, setRole] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    document.title = "Resume - Ishaan Singh";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Download Ishaan Singh's tailored resume based on the specific job role.";
  }, []);

  const handleDownload = (e) => {
    e.preventDefault();
    if (!role.trim()) return;
    
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Downloaded resume for role: ${role}`);
      setRole('');
    }, 1000);
  };

  return (
    <main>
      <BackButton />
      <header>
        <h1>Tailored Resume</h1>
        <p>Enter the role you are hiring for, and I will provide the most relevant version of my resume tailored to your needs.</p>
      </header>

      <section>
        <form onSubmit={handleDownload}>
          <label htmlFor="roleInput">Job Role</label>
          <input
            id="roleInput"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Frontend Engineer"
            required
          />
          <button type="submit" disabled={!role.trim() || isDownloading}>
            {isDownloading ? "Generating..." : "Download Resume"}
          </button>
        </form>
      </section>
    </main>
  );
}
