import { useEffect } from 'react';
import BackButton from '../components/BackButton';

export default function About() {
  useEffect(() => {
    document.title = "About Me - Ishaan Singh";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Learn more about Ishaan Singh, a passionate software engineer with a focus on creating immersive and highly performant web applications.";
  }, []);

  return (
    <>
      <BackButton />
      <main id="content" className="container section fade-in" data-od-id="about-hero">
        <div className="about-grid">
          <div className="stack">
            <p className="meta-label">About Me</p>
            <h1>Building worlds through code & aesthetics.</h1>
            <p className="lead">Senior Product Designer & Creative Developer focused on cinematic digital experiences.</p>
          </div>
          <div className="parallax-wrapper">
            <div className="parallax-card" id="profile-card">
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, black)'}}></div>
              <div style={{width: '100%', height: '100%', background: '#1a1a1a', display: 'grid', placeItems: 'center', color: '#404040', fontFamily: 'var(--font-mono)', fontSize: '12px'}}>
                [ PORTRAIT · CINEMATIC ]
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="section container fade-in" style={{animationDelay: '0.2s'}} data-od-id="bio">
        <div className="about-grid">
          <div></div>
          <div className="bio-text">
            <p>
              Hello! I am Ishaan Singh, a passionate software engineer with a strong focus on creating immersive and highly performant web applications. My journey in tech started with a deep curiosity for how things work, and that same curiosity drives me today to explore cutting-edge technologies like WebGPU, Three.js, and advanced React architectures.
            </p>
            <p>
              I specialize in full-stack development and 3D web experiences, bridging the gap between sophisticated backend logic and stunning, interactive user interfaces. Whether it is contributing to massive open-source projects like FFmpeg or crafting tailored AI solutions, I believe in writing code that is clean, scalable, and visually impactful.
            </p>
            <p>
              When I am not coding, you can find me exploring the latest in digital design trends, optimizing performance bottlenecks, or experimenting with new rendering techniques. I am always looking for the next challenging problem to solve.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
