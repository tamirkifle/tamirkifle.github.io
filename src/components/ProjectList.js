import React, { useState, useEffect } from 'react';
import Project from "./Project";
import CategoryFilter from "./CategoryFilter";
import { projects, categories } from "../ProjectData";

export default function ProjectList() {
  const [activeCategory, setActiveCategory] = useState("All Projects");
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate project counts for each category
  const projectCounts = {
    "All Projects": projects.filter(p => !p.isPlaceholder).length,
    ...Object.values(categories).reduce((acc, category) => ({
      ...acc,
      [category]: projects.filter(p => 
        p.categories && p.categories.includes(category) && !p.isPlaceholder
      ).length
    }), {})
  };

  useEffect(() => {
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      if (activeCategory === "All Projects") {
        setFilteredProjects(projects.filter(p => !p.isPlaceholder));
      } else {
        setFilteredProjects(projects.filter(p => 
          p.categories && p.categories.includes(activeCategory) && !p.isPlaceholder
        ));
      }
      setIsAnimating(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeCategory]);

  const handleCategoryChange = (category) => {
    if (category !== activeCategory) {
      setActiveCategory(category);
    }
  };

  // Render projects in a single grid
  const renderProjects = () => {
    // Sort projects to show featured ones first
    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

    return (
      <div className={`portfolio--projects ${isAnimating ? 'fade-out' : 'fade-in'}`}>
        {sortedProjects.map((project) => (
          <Project key={project.id || project.name} {...project} />
        ))}
      </div>
    );
  };

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <h2 className="portfolio--title">
          <span className="highlight">Selected Projects</span>
        </h2>
        
        <CategoryFilter 
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          projectCounts={projectCounts}
        />
        
        {filteredProjects.length === 0 ? (
          <div className="no-projects">
            <p>No projects found in this category.</p>
          </div>
        ) : (
          renderProjects()
        )}
      </div>
    </section>
  );
}