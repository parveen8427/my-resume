// src/pages/Home.jsx
import { useEffect } from "react";
import Navbar from "../components/Resume/Navbar";
import Profile from "../components/Resume/Profile";
import About from "../components/Resume/About";
import Skills from "../components/Resume/Skills";
import Contact from "../components/Resume/Contact";
import Experience from "../components/Resume/Experience";
import Languages from "../components/Resume/Languages";
import Education from "../components/Resume/Education";
import Projects from "../components/Resume/Projects";

const Home = () => {
  useEffect(() => {
    document.title = "Parveen Kumar - React Native Developer";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          <Profile />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Languages />
          <Contact />
        </div>
      </div>
    </div>
  );
};

export default Home;
