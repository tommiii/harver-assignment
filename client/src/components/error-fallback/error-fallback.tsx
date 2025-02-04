import { FallbackProps } from 'react-error-boundary';
import styles from './error-fallback.module.css';

interface ErrorFallbackProps extends FallbackProps {
  isDevelopment?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, isDevelopment = import.meta.env.DEV }) => {
  return (
    <div role="alert" className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Something went wrong</h2>
        {isDevelopment && error && (
          <pre className={styles.errorMessage}>
            {error.message}
          </pre>
        )}
        <div className={styles.buttonContainer}>
          <button
            onClick={() => window.location.reload()}
            className={styles.button}
          >
            Reload page
          </button>
        </div>
      </div>
    </div>
  );
};
