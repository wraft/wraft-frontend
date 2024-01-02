import withReduxStore from '../lib/with-redux-store';
import { StoreProvider } from 'easy-peasy';
import { AppProps } from 'next/app';

import { ThemeUIProvider, Alert, Close } from 'theme-ui';
import theme from '../utils/theme';

import 'react-day-picker/lib/style.css';
import { ToastProvider } from 'react-toast-notifications';
import { UserProvider } from '../contexts/AuthContext';
import ToasterNewProvider from '../contexts/ToasterProvider';

const StoreProviderOverride = StoreProvider as any;

interface AppPropsWithRedux extends AppProps {
  reduxStore: any;
}

interface MyCustomToastProps {
  appearance?: string;
  children?: any;
}
const MyCustomToast = ({ appearance, children }: MyCustomToastProps) => (
  <Alert variant={appearance === 'error' ? 'alert' : 'primary'}>
    {children}
    <Close ml="auto" mr={-2} />
  </Alert>
);

function MyApp({ Component, pageProps, reduxStore }: AppPropsWithRedux) {
  return (
    <StoreProviderOverride store={reduxStore}>
      <ToasterNewProvider />
      <ThemeUIProvider theme={theme}>
        {/* <GlobalStyle /> */}
        <ToastProvider
          autoDismiss
          autoDismissTimeout={1000}
          components={{ Toast: MyCustomToast }}
          placement="top-center">
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </ToastProvider>
      </ThemeUIProvider>
      {/* </ToasterNewProvider> */}
    </StoreProviderOverride>
  );
}

export default withReduxStore(MyApp);
