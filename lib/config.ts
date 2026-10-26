import { EnvironmentConfig } from './types';

class Config {
  private config: EnvironmentConfig | null = null;

  constructor() {
    // Don't load config in constructor - lazy load when needed
  }

  private loadConfig(): EnvironmentConfig {
    if (this.config) {
      return this.config;
    }

    // Always provide default values first, then override with env vars if available
    this.config = {
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://placeholder',
      JWT_SECRET: process.env.JWT_SECRET || '',
      EMAIL_HOST: process.env.EMAIL_HOST,
      EMAIL_PORT: process.env.EMAIL_PORT || '587',
      EMAIL_SECURE: process.env.EMAIL_SECURE || 'false',
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS,
      EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@smartinvoice.com',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    };

    return this.config;
  }

  get isDevelopment(): boolean {
    return this.loadConfig().NODE_ENV === 'development';
  }

  get isProduction(): boolean {
    return this.loadConfig().NODE_ENV === 'production';
  }

  get isTest(): boolean {
    return this.loadConfig().NODE_ENV === 'test';
  }

  get database(): {
    url: string;
    ssl: boolean;
  } {
    return {
      url: this.loadConfig().DATABASE_URL,
      ssl: this.isProduction,
    };
  }

  get jwt(): {
    secret: string;
    expiresIn: string;
  } {
    return {
      secret: this.loadConfig().JWT_SECRET,
      expiresIn: '7d',
    };
  }

  get email(): {
    host?: string;
    port: number;
    secure: boolean;
    user?: string;
    pass?: string;
    from: string;
    isConfigured: boolean;
  } {
    const config = this.loadConfig();
    const cleanPass = config.EMAIL_PASS ? config.EMAIL_PASS.replace(/\s+/g, '') : undefined;
    return {
      host: config.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(config.EMAIL_PORT || '587'),
      secure: config.EMAIL_SECURE === 'true' || parseInt(config.EMAIL_PORT || '587') === 465,
      user: config.EMAIL_USER,
      pass: cleanPass,
      from: config.EMAIL_FROM || config.EMAIL_USER || 'noreply@smartinvoice.com',
      isConfigured: !!(config.EMAIL_HOST && config.EMAIL_USER && cleanPass),
    };
  }

  get app(): {
    url: string;
    name: string;
    version: string;
  } {
    return {
      url: this.loadConfig().NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      name: 'SmartInvoice',
      version: '1.0.0',
    };
  }

  get security(): {
    bcryptRounds: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
  } {
    return {
      bcryptRounds: 10,
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
    };
  }

  get limits(): {
    maxInvoicesPerUser: number;
    maxClientsPerUser: number;
    maxItemsPerInvoice: number;
    maxFileSize: number;
  } {
    return {
      maxInvoicesPerUser: 1000,
      maxClientsPerUser: 500,
      maxItemsPerInvoice: 100,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    };
  }

  // Only validate at runtime, not during build
  validate(): void {
    const config = this.loadConfig();
    
    if (this.isProduction && (!config.JWT_SECRET || config.JWT_SECRET.length < 32)) {
      throw new Error('JWT_SECRET must be configured with at least 32 characters in production.');
    }

    // Validate email configuration if provided
    if (config.EMAIL_HOST && config.EMAIL_USER && config.EMAIL_PASS) {
      const port = parseInt(config.EMAIL_PORT || '587');
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error('EMAIL_PORT must be a valid port number between 1 and 65535');
      }
    }

    // Validate database URL format
    if (!config.DATABASE_URL.startsWith('postgresql://') && 
        !config.DATABASE_URL.startsWith('postgres://')) {
      throw new Error('DATABASE_URL must be a valid PostgreSQL connection string');
    }
  }
}

// Create singleton instance
const config = new Config();

export default config;
