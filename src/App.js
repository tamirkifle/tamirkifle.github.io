import React, { useState, useEffect } from "react";
import HeroSection from "./components/hero/HeroSection";
import Header from "./components/Header";
import About from "./components/About";
import ProjectList from "./components/ProjectList";
import Footer from "./components/Footer";
import ResumePage from "./components/resume/ResumePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState('portfolio');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#resume') {
        setCurrentPage('resume');
      } else {
        setCurrentPage('portfolio');
      }
    };

    // Check initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPage === 'resume') {
    return <ResumePage />;
  }

  return (
    <>
      <HeroSection />
      {/* <About /> */}
      <ProjectList />
      <Footer />
    </>
  );
}