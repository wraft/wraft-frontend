import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { TourProvider } from '@reactour/tour';
import { theme, GlobalStyle } from '@wraft/ui';
import { getSession } from 'next-auth/react';
import { ThemeUIProvider } from 'theme-ui';
import 'core-js/full/promise/with-resolvers.js';

import Analytics from 'components/common/Analytics';
import GoogleTagManager from 'components/common/GoogleTagManager';
import OnboardingWizard from 'components/Onboarding/OnboardingWizard';
import { UserProvider } from 'contexts/AuthContext';
import SocketProvider from 'contexts/SocketContext';
import ToasterNewProvider from 'contexts/ToasterProvider';
import NextAuthProviders from 'contexts/NextAuthProviders';
import { polyfillPromiseWithResolvers } from 'utils/PromiseWithResolvers';

polyfillPromiseWithResolvers();
interface AppPropsWithRedux extends AppProps {
  reduxStore: any;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithRedux) => {
  return (
    <TourProvider steps={[]}>
      <Analytics />
      <GoogleTagManager />
      <GlobalStyle />
      <NextAuthProviders session={session}>
        <ToasterNewProvider />
        <ThemeUIProvider theme={theme}>
          <UserProvider>
            <SocketProvider>
              <Component {...pageProps} />
              <OnboardingWizard />
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
