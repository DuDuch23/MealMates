import styles from './SkeletonCard.module.css';

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.image}></div>
      <div className={styles.text}></div>
      <div className={styles.category}>
        <div className={styles.category__container}></div>
      </div>
    </div>
  );
}

export default SkeletonCard;
