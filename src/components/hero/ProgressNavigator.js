import React, { useState, useEffect } from 'react';
import styles from './hero.module.css';

const ProgressNavigator = () => {
  const [activeSection, setActiveSection] = useState('hero');
  
  const sections = [
    {
      id: 'hero',
      label: 'INTRO',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="12" cy="12" r="3"></circle>
          <line x1="12" y1="5" x2="12" y2="9"></line>
          <line x1="12" y1="15" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="9" y2="12"></line>
          <line x1="15" y1="12" x2="19" y2="12"></line>
        </svg>
      )
    },
    // {
    //   id: 'about',
    //   label: 'ABOUT',
    //   icon: (
    //     <svg viewBox="0 0 24 24">
    //       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    //       <circle cx="12" cy="7" r="4"></circle>
    //     </svg>
    //   )
    // },
    {
      id: 'portfolio',
      label: 'PROJECTS',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      )
    },
    {
      id: 'blog',
      label: 'BLOG',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      id: 'contact',
      label: 'CONNECT',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      )
    }
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = window.scrollY + top;
          const absoluteBottom = window.scrollY + bottom;
          
          if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.progressNavigator}>
      {sections.map((section, index) => (
        <div key={section.id} className={styles.navItem}>
          <span 
            className={`${styles.navLabel} ${styles.flash}`}
            style={{ animationDelay: `${index * 2.5}s` }}
          >
            {section.label}
          </span>
          <div 
            className={`${styles.navIcon} ${activeSection === section.id ? styles.active : ''}`}
            onClick={() => handleNavClick(section.id)}
            data-section={section.id}
          >
            {section.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressNavigator;