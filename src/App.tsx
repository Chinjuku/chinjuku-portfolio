import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AllProjects from './pages/AllProjects';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <main className="bg-space-black min-h-screen text-white selection:bg-nebula-purple selection:text-white">
      <div className="grain-overlay" />

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjects />} />
      </Routes>
    </main>
  );
}

export default App;
