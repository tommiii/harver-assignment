interface LogData {
  message: string;
  [key: string]: unknown;
}

class Logger {
  private getPrefix(level: string): string {
    return `[${level.toUpperCase()}]`;
  }

  info(data: LogData): void {
    console.info(this.getPrefix("info"), data);
  }

  error(data: LogData): void {
    console.error(this.getPrefix("error"), data);
  }

  warn(data: LogData): void {
    console.warn(this.getPrefix("warn"), data);
  }

  debug(data: LogData): void {
    console.debug(this.getPrefix("debug"), data);
  }
}

export const logger = new Logger();
