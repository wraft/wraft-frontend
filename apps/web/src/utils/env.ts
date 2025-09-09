'use client';

interface EnvConfig {
  API_HOST: string;
  SELF_HOST_DISABLED: boolean;
  WEBSOCKET_URL: string;
  HOME_PAGE_URL: string;
  NEXT_AUTH_ENABLED: boolean;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  NEXTAUTH_SECRET: string;
  NEXT_PUBLIC_ANALYTICS_MODE: string | undefined;
  NEXT_PUBLIC_GTM_ID: string | undefined;
}

export const envConfig: EnvConfig = {
  API_HOST: process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4000',
  SELF_HOST_DISABLED: process.env.NEXT_PUBLIC_SELF_HOST_DISABLED === 'true',
  WEBSOCKET_URL:
    process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4000/socket',
  HOME_PAGE_URL: process.env.NEXT_PUBLIC_HOME_PAGE_URL || '/',
  NEXT_AUTH_ENABLED: process.env.NEXT_PUBLIC_NEXT_AUTH_ENABLED === 'true',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  NEXT_PUBLIC_ANALYTICS_MODE: process.env.NEXT_PUBLIC_ANALYTICS_MODE,
  NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
};

export const validateEnv = (): void => {
  const requiredVars = [
    'NEXT_PUBLIC_API_HOST',
    'NEXT_PUBLIC_WEBSOCKET_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
};

export default envConfig;
