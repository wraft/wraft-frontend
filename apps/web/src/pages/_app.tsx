import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { TourProvider, components } from '@reactour/tour';
import { theme, GlobalStyle } from '@wraft/ui';
import { SessionProvider, getSession } from 'next-auth/react';
import { ThemeUIProvider } from 'theme-ui';
import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google';
import 'core-js/full/promise/with-resolvers.js';

import { UserProvider } from 'contexts/AuthContext';
import ToasterNewProvider from 'contexts/ToasterProvider';
import { polyfillPromiseWithResolvers } from 'utils/PromiseWithResolvers';

polyfillPromiseWithResolvers();
interface AppPropsWithRedux extends AppProps {
  reduxStore: any;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithRedux) => {
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
  return (
    // <TourProvider steps={steps}>
    <TourProvider steps={[]} components={{ Badge }} padding={{ mask: 0 }}>
      <Analytics mode={'production'} />
      <GoogleTagManager gtmId="G-N0QTG72FK0" />
      <GlobalStyle />
      <SessionProvider session={session}>
        <ToasterNewProvider />
        <ThemeUIProvider theme={theme}>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </ThemeUIProvider>
      </SessionProvider>
    </TourProvider>
  );
};

export default MyApp;

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  const session = await getSession(context.ctx);

  return {
    ...appProps,
    session,
  };
};
