import withReduxStore from '../lib/with-redux-store';
import { StoreProvider } from 'easy-peasy';
import { AppProps } from 'next/app';

import { ThemeUIProvider } from 'theme-ui';
import theme from '../utils/theme';
import { Global } from '@emotion/react';

import { UserProvider } from '../contexts/AuthContext';
import ToasterNewProvider from '../contexts/ToasterProvider';
import globalStyles from '../globalStyles';

const StoreProviderOverride = StoreProvider as any;

interface AppPropsWithRedux extends AppProps {
  reduxStore: any;
}

const MyApp = ({ Component, pageProps, reduxStore }: AppPropsWithRedux) => {
  return (
    <StoreProviderOverride store={reduxStore}>
      <ToasterNewProvider />
      <ThemeUIProvider theme={theme}>
        <Global styles={globalStyles} />
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ThemeUIProvider>
      {/* </ToasterNewProvider> */}
    </StoreProviderOverride>
  );
};

export default withReduxStore(MyApp);
