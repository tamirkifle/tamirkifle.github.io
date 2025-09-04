import React, { useEffect, useRef } from 'react';
import FloatingArtifacts from './FloatingArtifacts';
import ProgressNavigator from './ProgressNavigator';
import ScrollIndicator from './ScrollIndicator';
import useMouseParallax from '../../hooks/useMouseParallax';
import useTextRotation from '../../hooks/useTextRotation';
import styles from './hero.module.css';

const HeroSection = () => {
  const nameRef = useRef(null);
  const { x, y } = useMouseParallax();
  const currentTagline = useTextRotation([
    'Distributed Systems Architect',
    'AI Infrastructure Engineer',
    'Building at Scale'
  ], 3000);

  useEffect(() => {
    // Split name into letters for animation
    if (nameRef.current) {
      const name = 'Tamir Yirga';
      nameRef.current.innerHTML = name.split('').map((char, i) => 
        char === ' ' ? ' ' : `<span class="letter">${char}</span>`
      ).join('');
    }
  }, []);

  return (
    <section className={styles.hero} id="hero">
      <FloatingArtifacts />
      <ProgressNavigator />
      
      <div className={styles.gridBackground}></div>
      <div 
        className={`${styles.orb} ${styles.orb1}`}
        style={{ transform: `translate(${x * 20}px, ${y * 20}px)` }}
      ></div>
      <div 
        className={`${styles.orb} ${styles.orb2}`}
        style={{ transform: `translate(${-x * 15}px, ${-y * 15}px)` }}
      ></div>
      
      <div className={styles.heroContent}>
        <h1 ref={nameRef} className={styles.heroName}>
          {/* Letters will be added by useEffect */}
        </h1>
        <div className={styles.heroTagline}>
          <span className={styles.taglineText}>
            {currentTagline}
          </span>
        </div>
      </div>
      
      <ScrollIndicator />
    </section>
  );
};

export default HeroSection;