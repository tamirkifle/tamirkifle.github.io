import React, { useState } from 'react';
import styles from './resume.module.css';

const AchievementBadges = () => {
  const [selectedCategory, setSelectedCategory] = useState('education');

  const education = {
    degree: 'Master of Science in Computer Science',
    school: 'Northeastern University',
    location: 'Seattle, WA',
    period: 'Sep 2024 - May 2026 (Expected)',
    gpa: 'GPA: 4.0/4.0',
    highlights: [
      'Building Scalable Distributed Systems',
      'Machine Learning',
      'Algorithms',
      'Object-Oriented Design'
    ],
    activities: [
      'Research Fellow: LLM hallucination detection with AWS ECS',
      'Teaching Assistant: Cloud Computing & Distributed Systems',
      'Graduate Leadership Institute Fellow',
      'Student Interest Group Leader (NU App Lab & NU Lead)'
    ]
  };

  const certifications = [
    {
      name: 'AWS Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2024',
      icon: '☁'
    },
    {
      name: 'Adobe Commerce Developer Expert',
      issuer: 'Adobe',
      year: '2024',
      icon: '◆'
    },
    {
      name: 'Adobe Commerce Developer Professional',
      issuer: 'Adobe',
      year: '2023',
      icon: '◇'
    },
    {
      name: 'Azure AI Engineer',
      issuer: 'Microsoft',
      year: '2021',
      icon: '⚡'
    },
    {
      name: 'Azure Fundamentals',
      issuer: 'Microsoft',
      year: '2021',
      icon: '⚡'
    }
  ];

  return (
    <div className={styles.achievementsContainer}>
      {/* Tab Navigation */}
      <div className={styles.tabNav}>
        <button 
          className={`${styles.tabButton} ${selectedCategory === 'education' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('education')}
        >
          Education
        </button>
        <button 
          className={`${styles.tabButton} ${selectedCategory === 'certifications' ? styles.active : ''}`}
          onClick={() => setSelectedCategory('certifications')}
        >
          Certifications
        </button>
      </div>

      {/* Content */}
      <div className={styles.tabContent}>
        {selectedCategory === 'education' && (
          <div className={styles.educationSection}>
            <div className={styles.degreeCard}>
              <div className={styles.degreeHeader}>
                <h3>{education.degree}</h3>
                <span className={styles.gpa}>{education.gpa}</span>
              </div>
              <p className={styles.school}>{education.school}</p>
              <p className={styles.period}>{education.period} • {education.location}</p>
              
              <div className={styles.courseWork}>
                <h4>Relevant Coursework</h4>
                <div className={styles.courseList}>
                  {education.highlights.map((course, index) => (
                    <span key={index} className={styles.courseItem}>
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.activities}>
                <h4>Activities & Leadership</h4>
                <ul>
                  {education.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'certifications' && (
          <div className={styles.certificationGrid}>
            {certifications.map((cert, index) => (
              <div key={index} className={styles.certCard}>
                <div className={styles.certIcon}>{cert.icon}</div>
                <h4>{cert.name}</h4>
                <p className={styles.certIssuer}>{cert.issuer}</p>
                <p className={styles.certYear}>{cert.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementBadges;