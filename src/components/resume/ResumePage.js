import React, { useEffect, useState } from 'react';
import ExperienceTimeline from './ExperienceTimeline';
import SkillsConstellation from './SkillsConstellation';
import EducationSection from './EducationSection';
import CertificationSection from './CertificationSection';
import styles from './resume.module.css';

const ResumePage = () => {
  const [activeSection, setActiveSection] = useState('experience');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['experience', 'education', 'skills', 'certifications', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (const section of sections) {
        const element = document.getElementById(`resume-${section}`);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const absoluteTop = window.scrollY + top;
          const absoluteBottom = window.scrollY + bottom;
          
          if (scrollPosition >= absoluteTop && scrollPosition <= absoluteBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBackClick = () => {
    window.location.href = '#hero';
  };

  return (
    <div className={styles.resumePage}>
      {/* Floating Back Button */}
      <button className={styles.backButton} onClick={handleBackClick}>
        <svg viewBox="0 0 24 24">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Portfolio</span>
      </button>

      {/* Progress Indicator */}
      <div className={styles.progressIndicator}>
        {['experience', 'education', 'skills', 'certifications', 'contact'].map(section => (
          <div 
            key={section}
            className={`${styles.progressDot} ${activeSection === section ? styles.active : ''}`}
            onClick={() => document.getElementById(`resume-${section}`)?.scrollIntoView({ behavior: 'smooth' })}
          />
        ))}
      </div>

      {/* Simple Header */}
      <section className={styles.resumeHeader}>
        <h1 className={styles.resumeTitle}>Tamir Yirga</h1>
        <p className={styles.resumeSubtitle}>Full Stack Engineer</p>
        <p className={styles.resumeSubtitle}>Distributed Systems • AI</p>
        <p className={styles.resumeSubtitle} >Seattle, WA</p>
      </section>

      {/* Experience Timeline */}
      <section id="resume-experience" className={styles.experienceSection}>
        <h2 className={styles.sectionTitle}>
          <span>Experience</span>
        </h2>
        <ExperienceTimeline />
      </section>

      {/* Education */}
      <section id="resume-education" className={styles.educationSection}>
        <h2 className={styles.sectionTitle}>
          <span>Education</span>
        </h2>
        <EducationSection />
      </section>

      {/* Skills */}
      <section id="resume-skills" className={styles.skillsSection}>
        <h2 className={styles.sectionTitle}>
          <span>Technical Skills</span>
        </h2>
        <SkillsConstellation />
      </section>

      {/* Certifications */}
      <section id="resume-certifications" className={styles.certificationsSection}>
        <h2 className={styles.sectionTitle}>
          <span>Certifications</span>
        </h2>
        <CertificationSection />
      </section>

      {/* Contact Section */}
      <section id="resume-contact" className={styles.contactSection}>
        <h2 className={styles.sectionTitle}>
          <span>Contact</span>
        </h2>
        <div className={styles.contactLinks}>
          <a href="mailto:tamirkyirga@gmail.com" className={styles.contactItem}>
            <svg viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span>Email</span>
          </a>
          <a href="https://linkedin.com/in/tamir-yirga" target="_blank" rel="noreferrer" className={styles.contactItem}>
            <svg viewBox="0 0 24 24">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/tamirkifle" target="_blank" rel="noreferrer" className={styles.contactItem}>
            <svg viewBox="0 0 24 24">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub</span>
          </a>
          <a href="tel:+12067855928" className={styles.contactItem}>
            <svg viewBox="0 0 24 24">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>Phone</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ResumePage;