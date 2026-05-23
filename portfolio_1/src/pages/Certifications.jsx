import { useEffect } from 'react';
import BackButton from '../components/BackButton';

export default function Certifications() {
  const certs = [
    { title: "Database Design and Basic SQL in PostgreSQL", issuer: "Coursera/ Uni of Michigan", date: "2026", link: "https://www.coursera.org/account/accomplishments/verify/38YM2RMPI8XO" },
  ];

  useEffect(() => {
    document.title = "Certifications - Ishaan Singh";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "View the professional certifications earned by Ishaan Singh, including AWS, React, and Three.js.";
  }, []);

  return (
    <>
      <BackButton />
      <main className="container section fade-in">
        <h1>Certifications</h1>
        <p className="lead">Here is a list of my professional certifications and achievements.</p>

        <div className="skills-grid" style={{ gridTemplateColumns: '1fr', maxWidth: '800px' }}>
          <div className="skill-group">
            <span className="category-title">Professional Achievements</span>
            {certs.map((cert, i) => (
              <div className="skill-item" key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span className="skill-name">{cert.title}</span>
                  <span className="social-label">{cert.issuer}</span>
                </div>
                <span className="skill-level">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
