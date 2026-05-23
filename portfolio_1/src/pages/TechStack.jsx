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

  // Group technologies by category
  const categories = allTech.reduce((acc, tech) => {
    if (!acc[tech.category]) acc[tech.category] = [];
    acc[tech.category].push(tech);
    return acc;
  }, {});

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
    <>
      <BackButton />
      <main className="container section fade-in" data-od-id="skills-content">
        <h1>Skills & Tech</h1>
        
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stack..." 
            autoComplete="off"
          />
        </div>

        <div className="skills-grid">
          {Object.entries(categories).map(([categoryName, techs]) => {
            const filteredTechs = techs.filter(tech => 
              tech.name.toLowerCase().includes(query.toLowerCase()) || 
              tech.category.toLowerCase().includes(query.toLowerCase())
            );

            if (filteredTechs.length === 0) return null;

            return (
              <div className="skill-group" key={categoryName}>
                <span className="category-title">{categoryName}</span>
                {filteredTechs.map(tech => (
                  <div className="skill-item" key={tech.name}>
                    <span className="skill-name">{tech.name}</span>
                    <span className="skill-level">Advanced</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
