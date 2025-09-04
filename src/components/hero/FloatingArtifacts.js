import React from 'react';
import styles from './hero.module.css';

const FloatingArtifacts = () => {
  const artifacts = [
    {
      id: 'resume',
      href: '#resume',
      label: 'Interactive Resume',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="5" y="3" width="14" height="18" rx="2"></rect>
          <line x1="9" y1="7" x2="15" y2="7"></line>
          <line x1="9" y1="11" x2="15" y2="11"></line>
          <line x1="9" y1="15" x2="12" y2="15"></line>
        </svg>
      )
    },
    {
      id: 'blog',
      href: '#blog',
      label: 'Tech Blog',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          <line x1="10" y1="8" x2="16" y2="8"></line>
          <line x1="10" y1="12" x2="14" y2="12"></line>
        </svg>
      )
    },
    {
      id: 'github',
      href: 'https://github.com/tamirkifle',
      label: 'GitHub',
      target: '_blank',
      icon: (
        <svg viewBox="0 0 24 24" strokeWidth="1.5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" fill="none"></path>
        </svg>
      )
    },
    {
      id: 'linkedin',
      href: 'https://www.linkedin.com/in/tamir-yirga',
      label: 'LinkedIn',
      target: '_blank',
      icon: (
        <svg viewBox="-2 -2 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin">
          <path d='M19.959 11.719v7.379h-4.278v-6.885c0-1.73-.619-2.91-2.167-2.91-1.182 0-1.886.796-2.195 1.565-.113.275-.142.658-.142 1.043v7.187h-4.28s.058-11.66 0-12.869h4.28v1.824l-.028.042h.028v-.042c.568-.875 1.583-2.126 3.856-2.126 2.815 0 4.926 1.84 4.926 5.792zM2.421.026C.958.026 0 .986 0 2.249c0 1.235.93 2.224 2.365 2.224h.028c1.493 0 2.42-.989 2.42-2.224C4.787.986 3.887.026 2.422.026zM.254 19.098h4.278V6.229H.254v12.869z' />
        </svg>
      )
    }
  ];

  return (
    <div className={styles.floatingArtifacts}>
      {artifacts.map((artifact) => (
        <a
          key={artifact.id}
          href={artifact.href}
          className={styles.artifact}
          target={artifact.target}
          rel={artifact.target === '_blank' ? 'noopener noreferrer' : undefined}
        >
          {artifact.icon}
          <span className={styles.artifactLabel}>{artifact.label}</span>
        </a>
      ))}
    </div>
  );
};

export default FloatingArtifacts;