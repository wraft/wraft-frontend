import { SessionProvider } from 'next-auth/react';

const NextAuthProviders = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) => (
  <>
    {process.env.NEXT_PUBLIC_NEXT_AUTH_ENABLED === 'true' ? (
      <SessionProvider session={session}>{children}</SessionProvider>
    ) : (
      children
    )}
  </>
);

export default NextAuthProviders;
