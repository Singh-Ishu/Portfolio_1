import { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';

export default function TechStack() {
  const [query, setQuery] = useState('');

  const allTech = [
    { name: 'React', category: 'Frontend' },
    { name: 'Three.js', category: 'Frontend / 3D' },
    { name: 'WebGPU', category: 'Graphics' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend / AI' },
    { name: 'C', category: 'Systems / Wasm' },
    { name: 'C++', category: 'Systems' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'JavaScript', category: 'Language' },
    { name: 'Blender', category: 'Design / 3D' },
    { name: 'TailwindCSS', category: 'Styling' },
    { name: 'Docker', category: 'DevOps' }
  ];

  const filteredTech = allTech.filter(tech => 
    tech.name.toLowerCase().includes(query.toLowerCase()) || 
    tech.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    document.title = "Tech Stack - Ishaan Singh";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Explore the diverse technology stack used by Ishaan Singh, spanning frontend, backend, graphics, and systems engineering.";
  }, []);

  return (
    <main>
      <BackButton />
      <header>
        <h1>Tech Stack</h1>
        <p>Search and explore the technologies I use.</p>
      </header>
      
      <section>
        <label htmlFor="techSearch">Search Technology</label>
        <input 
          id="techSearch"
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. React, Backend, C++" 
        />
      </section>

      <section>
        {filteredTech.length > 0 ? (
          <ul>
            {filteredTech.map((tech) => (
              <li key={tech.name}>
                <h2>{tech.name}</h2>
                <p>Category: {tech.category}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No technologies found matching "{query}".</p>
        )}
      </section>
    </main>
  );
}
