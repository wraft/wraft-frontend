import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { TourProvider, components } from '@reactour/tour';
import { theme, GlobalStyle } from '@wraft/ui';
import { getSession } from 'next-auth/react';
import { ThemeUIProvider } from 'theme-ui';
import 'core-js/full/promise/with-resolvers.js';

import Analytics from 'components/common/Analytics';
import GoogleTagManager from 'components/common/GoogleTagManager';
import { UserProvider } from 'contexts/AuthContext';
import SocketProvider from 'contexts/SocketContext';
import ToasterNewProvider from 'contexts/ToasterProvider';
import NextAuthProviders from 'contexts/NextAuthProviders';
import { polyfillPromiseWithResolvers } from 'utils/PromiseWithResolvers';

polyfillPromiseWithResolvers();
interface AppPropsWithRedux extends AppProps {
  reduxStore: any;
}

const Badge = ({ children }: any) => {
  return (
    <components.Badge
      styles={{
        badge: (base) => ({
          ...base,
          backgroundColor: '#BF3088',
          fontFamily: "'Poppins', sans-serif",
          fontSize: 14,
        }),
      }}>
      {children}
    </components.Badge>
  );
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithRedux) => {
  return (
    // <TourProvider steps={steps}>
    <TourProvider steps={[]} components={{ Badge }} padding={{ mask: 0 }}>
      <Analytics />
      <GoogleTagManager />
      <GlobalStyle />
      <NextAuthProviders session={session}>
        <ToasterNewProvider />
        <ThemeUIProvider theme={theme}>
          <UserProvider>
            <SocketProvider>
              <Component {...pageProps} />
            </SocketProvider>
          </UserProvider>
        </ThemeUIProvider>
      </NextAuthProviders>
    </TourProvider>
  );
};

export default MyApp;

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  const session =
    process.env.NEXT_PUBLIC_NEXT_AUTH_ENABLED === 'true'
      ? await getSession(context.ctx)
      : null;

  return {
    ...appProps,
    session,
  };
};
