import React, { useState } from 'react';
import styles from './resume.module.css';

const ExperienceTimeline = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const experiences = [
    {
      company: 'Canaria',
      location: 'New York, NY',
      role: 'Software Engineer Intern',
      period: 'Jul 2025 - Sep 2025',
      type: 'Labor Market Intelligence Platform',
      highlights: [
        'Built React data intelligence platform featuring multi-dashboard analytics, interactive charts, and LLM-powered querying',
        'Developed Python FastAPI service for text-to-SQL translation and dynamic chart generation, achieving 98% accuracy <1s latency',
        'Engineered Kafka-to-PostgreSQL streaming pipeline to maintain rolling 2-month datasets and power real-time analytics systems',
        'Established monitoring and feedback loops leveraging engagement data to guide metric-driven improvements and boost adoption'
      ],
      tech: ['React', 'Python', 'FastAPI', 'Kafka', 'PostgreSQL', 'LLM Integration'],
      color: 'var(--accent-cyan)'
    },
    {
      company: 'Scandiweb',
      location: 'Riga, Latvia',
      role: 'Full Stack Engineer',
      period: 'May 2022 - Aug 2024',
      type: 'Adobe Commerce E-commerce Agency',
      highlights: [
        'Delivered full stack features across 7+ e-commerce projects using JavaScript, React, and PHP to serve enterprise customers',
        'Rebuilt checkout flows across multiple platforms, reducing cart abandonment by up to 18% through UX and reliability updates',
        'Led CMS refactor for large-scale storefront, modularizing content blocks to reduce new page code by 45% and accelerate updates',
        'Owned platform upgrades for newly onboarded client, refactoring 60%+ of legacy modules with zero post-deployment regressions'
      ],
      tech: ['JavaScript', 'React', 'PHP', 'Adobe Commerce', 'GraphQL'],
      color: 'var(--accent-amber)'
    },
    {
      company: 'Endubis Blockchain Solutions',
      location: 'Addis Ababa, Ethiopia',
      role: 'Full Stack Engineer',
      period: 'Apr 2021 - May 2022',
      type: 'Cardano Wallet Platform',
      highlights: [
        'Launched secure crypto wallet platform using Node.js and React, successfully onboarding 7K+ users within Telegram ecosystem',
        'Migrated backend from self-hosted nodes to scalable blockchain API, increasing uptime to 99.9% and cutting latency by 60%',
        'Built real-time Google Cloud Firestore data layer serving 3K+ active users, achieving wallet sync latency of <300ms globally',
        'Engineered SSL-secured web layer for transaction signing, overcoming Telegram security limitations while preserving usability'
      ],
      tech: ['Node.js', 'React', 'Firestore', 'Blockchain', 'Telegram API'],
      color: 'var(--accent-cyan)'
    }
  ];

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={styles.timeline}>
      {experiences.map((exp, index) => (
        <div 
          key={index}
          className={`${styles.timelineItem} ${expandedIndex === index ? styles.expanded : ''}`}
          onClick={() => handleExpand(index)}
        >
          <div className={styles.timelineDot} style={{ background: exp.color }}></div>
          <div className={styles.timelineContent}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineHeaderLeft}>
                <h3 className={styles.companyName}>{exp.company}</h3>
                <p className={styles.role}>{exp.role}</p>
                <p className={styles.type}>{exp.type}</p>
              </div>
              <div className={styles.timelineHeaderRight}>
                <p className={styles.period}>{exp.period}</p>
                <p className={styles.location}>{exp.location}</p>
              </div>
            </div>
            
            <div className={styles.expandIcon}>
              <svg viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {expandedIndex === index && (
              <div className={styles.timelineExpanded}>
                <div className={styles.highlights}>
                  <h4>Key Achievements</h4>
                  <ul>
                    {exp.highlights.map((highlight, hIndex) => (
                      <li key={hIndex}>{highlight}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.techStack}>
                  <h4>Technologies</h4>
                  <div className={styles.techTags}>
                    {exp.tech.map((tech, tIndex) => (
                      <span key={tIndex} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceTimeline;