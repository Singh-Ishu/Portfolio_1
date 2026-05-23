import { useEffect } from 'react';
import BackButton from '../components/BackButton';

export default function Contact() {
  useEffect(() => {
    document.title = "Contact Me - Ishaan Singh";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Get in touch with Ishaan Singh. Contact me via Email, GitHub, or Phone for opportunities and collaboration.";
  }, []);

  return (
    <>
      <BackButton />
      <main className="container section fade-in" data-od-id="contact-content">
        <h1>Get in touch</h1>
        <p className="lead">Available for collaborations and creative projects.</p>

        <div className="social-grid">
          <a href="https://github.com/Singh-Ishu" target="_blank" rel="noopener noreferrer" className="social-card">
            <span className="social-label">Github</span>
            <span className="social-val">@Singh-Ishu</span>
          </a>
          <a href="https://in.linkedin.com/in/ishaan-singh-174123293" target="_blank" rel="noopener noreferrer" className="social-card">
            <span className="social-label">LinkedIn</span>
            <span className="social-val">in/ishaan-singh-174123293</span>
          </a>
          <a href="#" className="social-card">
            <span className="social-label">Discord</span>
            <span className="social-val">creative_dev#0000</span>
          </a>
          <a href="mailto:itzshaansingh@gmail.com" className="social-card">
            <span className="social-label">Email</span>
            <span className="social-val">itzshaan@gmail.com</span>
          </a>
        </div>


      </main>
    </>
  );
}
