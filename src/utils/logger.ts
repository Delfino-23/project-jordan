/**
 * Logger simples para aplicação
 */

enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

class Logger {
  private formatMessage(level: LogLevel, message: string, error?: any): string {
    const timestamp = new Date().toISOString();
    const errorStr = error ? ` - ${error.message || error}` : '';
    return `[${timestamp}] [${level}] ${message}${errorStr}`;
  }

  error(message: string, error?: any): void {
    const formatted = this.formatMessage(LogLevel.ERROR, message, error);
    console.error(formatted);
  }

  warn(message: string): void {
    const formatted = this.formatMessage(LogLevel.WARN, message);
    console.warn(formatted);
  }

  info(message: string): void {
    const formatted = this.formatMessage(LogLevel.INFO, message);
    console.log(formatted);
  }

  debug(message: string): void {
    if (process.env.NODE_ENV !== 'production') {
      const formatted = this.formatMessage(LogLevel.DEBUG, message);
      console.log(formatted);
    }
  }
}

export default new Logger();
