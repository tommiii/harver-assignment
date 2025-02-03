declare module 'react-logger' {
  interface Logger {
    error(data: { 
      message: string;
      error?: Error;
      componentStack?: string;
      timestamp?: string;
      [key: string]: any;
    }): void;
    warn(data: object): void;
    info(data: object): void;
    debug(data: object): void;
  }

  const logger: Logger;
  export default logger;
} 