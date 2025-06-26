import styles from "./StatCard.module.css";
export default function StatCard({ title, value, icon }) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{value}</p>
      </div>
    </div>
  );
}

