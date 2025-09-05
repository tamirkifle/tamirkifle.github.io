import React, { useState } from 'react';
import styles from './resume.module.css';

const SkillsConstellation = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const skillCategories = [
    {
      name: 'Languages',
      icon: '{ }',
      skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'Go', 'C++', 'SQL'],
      color: 'var(--accent-cyan)'
    },
    {
      name: 'Web Development',
      icon: '< />',
      skills: ['React', 'Node.js', 'Spring Boot', 'FastAPI', 'GraphQL', 'gRPC'],
      color: 'var(--accent-amber)'
    },
    {
      name: 'Distributed Systems',
      icon: '⬢',
      skills: ['Docker', 'Kubernetes', 'Kafka', 'Redis', 'Terraform'],
      color: 'var(--accent-cyan)'
    },
    {
      name: 'Cloud Platforms',
      icon: '☁',
      skills: ['AWS (EC2, S3, Lambda, ECS)', 'GCP (Firestore, Compute Engine, Vertex AI)', 'Azure (VMs)'],
      color: 'var(--accent-amber)'
    },
    {
      name: 'Machine Learning',
      icon: '⊙',
      skills: ['PyTorch', 'TensorFlow', 'scikit-learn', 'pandas', 'NumPy', 'MLflow'],
      color: 'var(--accent-cyan)'
    },
    {
      name: 'Databases',
      icon: '◈',
      skills: ['PostgreSQL', 'MongoDB', 'DynamoDB', 'Neo4j', 'Elasticsearch', 'Firestore'],
      color: 'var(--accent-amber)'
    }
  ];

  return (
    <div className={styles.skillsGrid}>
      {skillCategories.map((category, index) => (
        <div 
          key={index}
          className={`${styles.skillCategory} ${activeCategory === index ? styles.active : ''}`}
          onMouseEnter={() => setActiveCategory(index)}
          onMouseLeave={() => setActiveCategory(null)}
          style={{ '--category-color': category.color }}
        >
          <div className={styles.categoryIcon}>
            {category.icon}
          </div>
          <h3 className={styles.categoryName}>{category.name}</h3>
          <div className={styles.skillsList}>
            {category.skills.map((skill, skillIndex) => (
              <span 
                key={skillIndex}
                className={styles.skillTag}
                style={{ 
                  animationDelay: `${skillIndex * 0.05}s`,
                  '--skill-color': category.color
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsConstellation;