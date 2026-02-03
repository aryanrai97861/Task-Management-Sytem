type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

const colors = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  debug: '\x1b[35m',   // Magenta
  reset: '\x1b[0m',
};

function formatLog(entry: LogEntry): string {
  const { level, message, timestamp, data } = entry;
  const color = colors[level];
  const levelStr = level.toUpperCase().padEnd(5);
  let logStr = `${color}[${timestamp}] ${levelStr}${colors.reset} ${message}`;
  
  if (data) {
    logStr += ` ${JSON.stringify(data)}`;
  }
  
  return logStr;
}

export const logger = {
  info: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      data,
    };
    console.log(formatLog(entry));
  },

  warn: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      data,
    };
    console.warn(formatLog(entry));
  },

  error: (message: string, data?: unknown) => {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      data,
    };
    console.error(formatLog(entry));
  },

  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      const entry: LogEntry = {
        level: 'debug',
        message,
        timestamp: new Date().toISOString(),
        data,
      };
      console.log(formatLog(entry));
    }
  },
};

// Request logging middleware
import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    };
    
    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
}
