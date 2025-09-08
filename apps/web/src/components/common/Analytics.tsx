import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import envConfig from 'utils/env';

interface AnalyticsProps {
  mode?: 'production' | 'development';
}

const Analytics = ({ mode }: AnalyticsProps) => {
  const analyticsMode = mode || envConfig.NEXT_AUTH_ENABLED;

  if (!analyticsMode) {
    return null;
  }

  return (
    <VercelAnalytics mode={analyticsMode as 'production' | 'development'} />
  );
};

export default Analytics;
