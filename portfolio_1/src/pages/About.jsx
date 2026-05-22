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
    <main>
      <BackButton />
      <header>
        <h1>About Me</h1>
      </header>
      
      <section>
        <p>
          Hello! I am Ishaan Singh, a passionate software engineer with a strong focus on creating immersive and highly performant web applications. My journey in tech started with a deep curiosity for how things work, and that same curiosity drives me today to explore cutting-edge technologies like WebGPU, Three.js, and advanced React architectures.
        </p>
        <p>
          I specialize in full-stack development and 3D web experiences, bridging the gap between sophisticated backend logic and stunning, interactive user interfaces. Whether it is contributing to massive open-source projects like FFmpeg or crafting tailored AI solutions, I believe in writing code that is clean, scalable, and visually impactful.
        </p>
        <p>
          When I am not coding, you can find me exploring the latest in digital design trends, optimizing performance bottlenecks, or experimenting with new rendering techniques. I am always looking for the next challenging problem to solve.
        </p>
      </section>
    </main>
  );
}
