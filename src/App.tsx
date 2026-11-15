import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import Home from "./pages/Home";
import AllProjects from "./pages/AllProjects";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  return (
    <main className="bg-space-white dark:bg-space-black min-h-screen text-space-black dark:text-white selection:bg-nebula-purple selection:text-white transition-colors duration-300">
      <div className="grain-overlay" />

      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjects />} />
      </Routes>
    </main>
  );
}

export default App;
