import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ScrollToTop from "./components/common/ScrollToTop";
import Home from "./pages/Home";
import AllProjects from "./pages/AllProjects";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger globally
gsap.registerPlugin(ScrollTrigger);

// Isolated visual-exploration route (lazy so three.js stays out of the main bundle)
const HeroConcepts = lazy(() => import("./pages/HeroConcepts"));

function App() {
  const isConcepts = useLocation().pathname === "/hero-concepts";

  return (
    <main className="bg-space-white dark:bg-space-black min-h-screen text-space-black dark:text-white selection:bg-nebula-purple selection:text-white transition-colors duration-300">
      {!isConcepts && <div className="grain-overlay" />}

      <ScrollToTop />
      {!isConcepts && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjects />} />
        <Route
          path="/hero-concepts"
          element={
            <Suspense fallback={null}>
              <HeroConcepts />
            </Suspense>
          }
        />
      </Routes>
    </main>
  );
}

export default App;
