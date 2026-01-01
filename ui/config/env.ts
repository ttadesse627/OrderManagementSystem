export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

export type Environment = typeof env;