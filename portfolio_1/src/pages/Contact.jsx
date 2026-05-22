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
    <main>
      <BackButton />
      <header>
        <h1>Contact Me</h1>
        <p>I am open to discussing new projects and opportunities.</p>
      </header>

      <section>
        <article>
          <h2>GitHub</h2>
          <p>Check out my latest open source contributions and projects.</p>
          <a href="https://github.com/ishaansingh" target="_blank" rel="noopener noreferrer">Visit GitHub Profile</a>
        </article>

        <article>
          <h2>Email</h2>
          <p>Send me an email to get in touch about opportunities.</p>
          <a href="mailto:ishaan@example.com">Send Email</a>
        </article>

        <article>
          <h2>Phone</h2>
          <p>Call me for urgent inquiries or direct communication.</p>
          <a href="tel:+1234567890">Call Me</a>
        </article>
      </section>
    </main>
  );
}
