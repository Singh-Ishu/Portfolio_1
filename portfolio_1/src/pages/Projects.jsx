import { useState, useEffect, useRef } from 'react';
import BackButton from '../components/BackButton';
import projectsData from '../data/projects.json';
import githubIcon from '../assets/github.png';
import webIcon from '../assets/web.png';

function ProjectCard({ project }) {
  const innerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!innerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (y - 0.5) * -15;
    const rotateY = (x - 0.5) * 15;

    innerRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    if (!innerRef.current) return;
    innerRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <article
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-inner" ref={innerRef}>
        <div className="project-links">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer" title="View Source">
              <img src={githubIcon} alt="GitHub" width="24" height="24" style={{ filter: 'invert(1)', opacity: 0.8, transition: 'opacity 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0.8} />
            </a>
          )}
          {project.livelink && (
            <a href={project.livelink} target="_blank" rel="noopener noreferrer" title="Live Preview">
              <img src={webIcon} alt="Live Link" width="24" height="24" style={{ filter: 'invert(1)', opacity: 0.8, transition: 'opacity 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.opacity = 1} onMouseOut={(e) => e.currentTarget.style.opacity = 0.8} />
            </a>
          )}
        </div>
        <p className="metric-label" style={{ marginBottom: '8px' }}>{project.normalTags[0] || 'Project'}</p>
        <h2>{project.title}</h2>
        <p className="project-subtitle">{project.subtitle}</p>

        <div className="project-tech">
          {project.stackTags.map(tech => (
            <span key={tech} className="tech-pill">{tech}</span>
          ))}
        </div>

        <div className="project-metrics">
          <ul style={{ gridColumn: '1 / -1', listStyleType: 'disc', paddingLeft: '20px', margin: 0, color: 'var(--muted)', fontSize: '14px', lineHeight: '1.6' }}>
            {project.points.map((point, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{point}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');

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

  const allTags = Array.from(new Set(projectsData.flatMap(p => p.normalTags)));

  const filteredProjects = filter === 'all'
    ? projectsData
    : projectsData.filter(p => p.normalTags.includes(filter));

  return (
    <>
      <BackButton />
      <main className="container section fade-in" data-od-id="projects-content">
        <h1>Featured Projects</h1>

        <div className="tag-filter">
          <button
            className={`tag-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-btn ${filter === tag ? 'active' : ''}`}
              onClick={() => setFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="project-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </>
  );
}
