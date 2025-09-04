import React from 'react';
import styles from './hero.module.css';

const ScrollIndicator = () => {
  const handleClick = () => {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.scrollIndicator} onClick={handleClick}>
      <div className={styles.scrollLine}></div>
      <div className={styles.scrollText}>SCROLL</div>
    </div>
  );
};

export default ScrollIndicator;