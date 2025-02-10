interface LogData {
  message: string;
  [key: string]: unknown;
}

const isDevelopment = import.meta.env.DEV;

class Logger {
  private getPrefix(level: string): string {
    return `[${level.toUpperCase()}]`;
  }

  private log(level: string, data: LogData): void {
    if (!isDevelopment) return;

    switch (level) {
      case "info":
        console.info(this.getPrefix(level), data);
        break;
      case "error":
        console.error(this.getPrefix(level), data);
        break;
      case "warn":
        console.warn(this.getPrefix(level), data);
        break;
      case "debug":
        console.debug(this.getPrefix(level), data);
        break;
    }
  }

  info(data: LogData): void {
    this.log("info", data);
  }

  error(data: LogData): void {
    this.log("error", data);
  }

  warn(data: LogData): void {
    this.log("warn", data);
  }

  debug(data: LogData): void {
    this.log("debug", data);
  }
}

export const logger = new Logger();
