import React from "react";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import CodeActivities from "../components/CodeActivities";
import Experience from "../components/Experience";
import About from "../components/About";
import Contact from "../components/Contact";
import ScrollToTop from "../components/common/ScrollToTop";

const Home: React.FC = () => {
  return (
    <>
      <div id="hero">
        <Hero />
      </div>

      <div id="skills">
        <Skills />
      </div>

      <div id="projects">
        <Projects />
      </div>

      <div id="activity">
        <CodeActivities />
      </div>

      <div id="experience">
        <Experience />
      </div>

      <div id="about">
        <About />
      </div>

      <div id="contact">
        <Contact />
      </div>

      <ScrollToTop />
    </>
  );
};

export default Home;
