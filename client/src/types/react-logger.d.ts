declare module 'react-logger' {
  interface LogData {
    message?: string;
    error?: Error;
    componentStack?: string;
    timestamp?: string;
    [key: string]: string | number | boolean | Error | undefined;
  }

  interface Logger {
    error(data: LogData): void;
    warn(data: LogData): void;
    info(data: LogData): void;
    debug(data: LogData): void;
  }

  const logger: Logger;
  export default logger;
} 