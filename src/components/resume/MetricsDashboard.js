import React, { useState, useEffect } from 'react';
import styles from './resume.module.css';

const MetricsDashboard = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    experience: 0,
    projects: 0,
    technologies: 0,
    users: 0
  });

  const targetValues = {
    experience: 4,
    projects: 15,
    technologies: 30,
    users: 10000
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('metrics-container');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const intervals = {};
    
    Object.keys(targetValues).forEach(key => {
      const target = targetValues[key];
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      intervals[key] = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervals[key]);
        }
        setCounters(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, 16);
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [isVisible]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
  };

  const metrics = [
    {
      label: 'Years Experience',
      value: counters.experience,
      suffix: '+',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      label: 'Projects Shipped',
      value: counters.projects,
      suffix: '+',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
        </svg>
      )
    },
    {
      label: 'Technologies',
      value: counters.technologies,
      suffix: '+',
      icon: (
        <svg viewBox="0 0 24 24">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
      )
    },
    {
      label: 'Users Served',
      value: formatNumber(counters.users),
      suffix: '',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    }
  ];

  return (
    <div id="metrics-container" className={styles.metricsContainer}>
      <div className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className={`${styles.metricCard} ${isVisible ? styles.visible : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.metricIcon}>
              {metric.icon}
            </div>
            <div className={styles.metricValue}>
              {metric.value}{metric.suffix}
            </div>
            <div className={styles.metricLabel}>
              {metric.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.summaryText}>
        <p>
          Specializing in distributed systems and real-time data infrastructure to build scalable, 
          intelligent solutions that power modern applications. Proven in architecting and shipping 
          production systems from concept to deployment.
        </p>
      </div>
    </div>
  );
};

export default MetricsDashboard;