
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.landingContainer}>
      <div className={styles.landingContent}>
        <img src="/logo-citalf.svg" alt="Citalf Logo" className={styles.logo} />
        <h1 className={styles.title}>Welcome to Citalf Backtester</h1>
        <p className={styles.subtitle}>
          Analyze and backtest your trading strategies with real historical data. Fast, secure, and easy to use.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.googleButton}>
            <img src="/logo192.png" alt="Google" className={styles.googleIcon} />
            Sign in with Google
          </button>
          <button className={styles.emailButton}>Sign up with Email</button>
          <button className={styles.loginButton}>Login</button>
        </div>
      </div>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Citalf. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage; 