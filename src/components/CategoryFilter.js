import React from 'react';
import styles from './CategoryFilter.module.css';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange, projectCounts }) => {
  const categoryIcons = {
    "All Projects": (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
      </svg>
    ),
    "Distributed Systems": (
      <svg viewBox="0 0 24 24">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    "AI/ML Platforms": (
      <svg viewBox="0 0 24 24">
        <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"></path>
        <path d="M12 8v4"></path>
        <path d="M12 16h.01"></path>
      </svg>
    ),
    "Blockchain": (
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
    ),
    "Data Engineering": (
      <svg viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
    "Full-Stack Apps": (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    )
  };

  return (
    <div className={styles.categoryFilter}>
      <div className={styles.filterContainer}>
        {["All Projects", ...Object.values(categories)].map(category => (
          <button
            key={category}
            className={`${styles.filterButton} ${activeCategory === category ? styles.active : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            <span className={styles.icon}>
              {categoryIcons[category]}
            </span>
            <span className={styles.label}>{category}</span>
            {projectCounts && (
              <span className={styles.count}>
                {projectCounts[category] || 0}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;