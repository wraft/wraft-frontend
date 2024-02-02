import { TourProvider, components } from '@reactour/tour';
import { theme } from '@wraft/ui';
import App from 'next/app';
import type { AppProps, AppContext } from 'next/app';
import { SessionProvider, getSession } from 'next-auth/react';
import { ThemeUIProvider } from 'theme-ui';
// import { Theme } from 'theme-ui';

import { UserProvider } from '../contexts/AuthContext';
import ToasterNewProvider from '../contexts/ToasterProvider';
// import theme from '../theme';

// import theme from '../utils/theme';
// theme
// const makeTheme = <T extends Theme>(t: T): T => t;
// const themes = makeTheme(theme);
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
