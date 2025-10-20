import styles from './AnimatedWaveBackground.module.css';

export default function AnimatedWaveBackground() {
  return (
    <div className={styles.waveContainer}>
      <svg 
        className={styles.wave1}
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          fill="rgba(46, 139, 87, 0.4)"
        />
      </svg>

      <svg 
        className={styles.wave2}
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 Q300,10 600,60 T1200,60 L1200,120 L0,120 Z"
          fill="rgba(60, 179, 113, 0.3)"
        />
      </svg>

      <svg 
        className={styles.wave3}
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path
          d="M0,70 Q300,20 600,70 T1200,70 L1200,120 L0,120 Z"
          fill="rgba(79, 184, 128, 0.2)"
        />
      </svg>

      <div className={styles.waveOverlay}></div>
    </div>
  );
}