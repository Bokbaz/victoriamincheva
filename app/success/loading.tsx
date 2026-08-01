import styles from "./success.module.css";

export default function SuccessLoading() {
  return (
    <main className={styles.page} id="main-content">
      <div aria-label="Confirming your payment" className={styles.loadingPanel} role="status">
        <div className={styles.loadingMark} />
        <div className={styles.loadingLineWide} />
        <div className={styles.loadingLine} />
        <p>Confirming your payment...</p>
      </div>
    </main>
  );
}
