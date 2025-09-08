import { GoogleTagManager as NextGoogleTagManager } from '@next/third-parties/google';

import envConfig from 'utils/env';

interface GoogleTagManagerProps {
  gtmId?: string;
}

const GoogleTagManager = ({ gtmId }: GoogleTagManagerProps) => {
  const tagManagerId = gtmId || envConfig.NEXT_PUBLIC_GTM_ID;

  if (!tagManagerId) {
    return null;
  }

  return <NextGoogleTagManager gtmId={tagManagerId} />;
};

export default GoogleTagManager;
