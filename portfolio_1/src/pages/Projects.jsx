import { useEffect } from 'react';
import BackButton from '../components/BackButton';
import projectsData from '../data/projects.json';

export default function Projects() {
  useEffect(() => {
    document.title = "Projects - Ishaan Singh";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Explore the featured projects by Ishaan Singh, including web development, 3D experiences, and systems programming.";
  }, []);

  return (
    <main>
      <BackButton />
      <header>
        <h1>Featured Projects</h1>
        <p>A selection of my recent work and technical achievements.</p>
      </header>

      <section>
        {projectsData.map((project) => (
          <article key={project.id}>
            <h2>{project.title}</h2>
            <h3>{project.subtitle}</h3>
            
            <ul>
              {project.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>

            <div>
              <strong>Tech Stack:</strong> {project.stackTags.join(', ')}
            </div>

            <div>
              <strong>Categories:</strong> {project.normalTags.join(', ')}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
