import React from 'react';
import styles from './resume.module.css';

const EducationSection = () => {
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
      'Software Design Paradigms',
      'Computer Vision'
    ],
    activities: [
      'Research Fellow: LLM hallucination detection with AWS ECS',
      'Teaching Assistant: Cloud Computing & Distributed Systems',
      'Graduate Leadership Institute Fellow',
      'Student Interest Group Leader (NU App Lab & NU Lead)',
      'Perplexity Campus Ambassador'
    ]
  };

  return (
    <div className={styles.educationContainer}>
      <div className={styles.degreeCard}>
        <div className={styles.degreeHeader}>
          <div>
            <h3>{education.degree}</h3>
            <p className={styles.school}>{education.school}</p>
            <p className={styles.period}>{education.period} • {education.location}</p>
          </div>
          <span className={styles.gpa}>{education.gpa}</span>
        </div>
        
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
  );
};

export default EducationSection;