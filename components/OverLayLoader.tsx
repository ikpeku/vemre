import styles from './OverlayLoader.module.css';
export default function OverlayLoader() {
    return (
      <div className={styles.overlay}>
        <div className={styles.spinner}></div>
      </div>
    );
  }