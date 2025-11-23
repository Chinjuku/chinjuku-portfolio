import React from 'react';
import Hero from '../components/Hero';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import About from '../components/About';
import Contact from '../components/Contact';

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

            <div id="experience">
                <Experience />
            </div>

            <div id="about">
                <About />
            </div>

            <div id="contact">
                <Contact />
            </div>
        </>
    );
};

export default Home;
