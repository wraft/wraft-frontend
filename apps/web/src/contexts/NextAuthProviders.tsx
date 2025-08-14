import { SessionProvider } from 'next-auth/react';

import envConfig from 'utils/env';

const NextAuthProviders = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => {
  const isNextAuthEnabled = envConfig.NEXT_AUTH_ENABLED;

  if (!isNextAuthEnabled) {
    return <>{children}</>;
  }

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default NextAuthProviders;
