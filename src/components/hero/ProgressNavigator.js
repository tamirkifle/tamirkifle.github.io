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
    {
      id: 'portfolio',
      label: 'DISTRIBUTED SYSTEMS',
      icon: (
        <svg viewBox="0 0 24 24">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      )
    },
    {
      id: 'ai-projects',
      label: 'AI PLATFORMS',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
          <path d="M12 8v4"></path>
          <path d="M12 16h.01"></path>
        </svg>
      )
    },
    {
      id: 'blockchain',
      label: 'BLOCKCHAIN',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
          <line x1="10" y1="6.5" x2="14" y2="6.5"></line>
          <line x1="6.5" y1="10" x2="6.5" y2="14"></line>
          <line x1="10" y1="17.5" x2="14" y2="17.5"></line>
          <line x1="17.5" y1="10" x2="17.5" y2="14"></line>
        </svg>
      )
    },
    {
      id: 'blog',
      label: 'THOUGHTS',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
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