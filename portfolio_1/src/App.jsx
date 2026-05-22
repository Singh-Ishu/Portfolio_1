import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Scene from './pages/scene.jsx';
import Contact from './pages/Contact.jsx';
import Projects from './pages/Projects.jsx';
import Resume from './pages/Resume.jsx';
import About from './pages/About.jsx';
import Certifications from './pages/Certifications.jsx';
import TechStack from './pages/TechStack.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Scene />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/about" element={<About />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/tech-stack" element={<TechStack />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
