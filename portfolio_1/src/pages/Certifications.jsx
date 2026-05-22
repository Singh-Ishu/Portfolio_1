import { useEffect } from 'react';
import BackButton from '../components/BackButton';

export default function Certifications() {
  const certs = [
    { title: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "2025" },
    { title: "Advanced React Patterns", issuer: "Frontend Masters", date: "2024" },
    { title: "WebGL & Three.js Deep Dive", issuer: "Three.js Journey", date: "2024" },
    { title: "C++ Performance Engineering", issuer: "Udacity", date: "2023" }
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
    <main>
      <BackButton />
      <header>
        <h1>Certifications</h1>
        <p>Here is a list of my professional certifications and achievements.</p>
      </header>

      <section>
        <ul>
          {certs.map((cert, i) => (
            <li key={i}>
              <h2>{cert.title}</h2>
              <p><strong>Issuer:</strong> {cert.issuer}</p>
              <p><strong>Year:</strong> {cert.date}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
