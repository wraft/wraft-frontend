import { StoreProvider } from 'easy-peasy';
import { AppProps } from 'next/app';
import { ThemeUIProvider } from 'theme-ui';

import { UserProvider } from '../contexts/AuthContext';
import ToasterNewProvider from '../contexts/ToasterProvider';
import withReduxStore from '../lib/with-redux-store';
import theme from '../utils/theme';

const StoreProviderOverride = StoreProvider as any;

interface AppPropsWithRedux extends AppProps {
  reduxStore: any;
}

const MyApp = ({ Component, pageProps, reduxStore }: AppPropsWithRedux) => {
  return (
    <StoreProviderOverride store={reduxStore}>
      <ToasterNewProvider />
      <ThemeUIProvider theme={theme}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ThemeUIProvider>
    </StoreProviderOverride>
  );
};

export default withReduxStore(MyApp);
