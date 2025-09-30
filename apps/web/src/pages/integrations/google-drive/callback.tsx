import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Flex, Spinner, Text } from '@wraft/ui';

import { fetchAPI } from 'utils/models';

const GoogleDriveCallback = () => {
  const router = useRouter();

  console.log('GoogleDriveCallback');

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);

      console.log('window.location.search', window);
      const code = urlParams.get('code');
      const error = urlParams.get('error');
      const state = urlParams.get('state');

      if (error) {
        // Handle OAuth error
        console.error('OAuth error:', error);

        // Send error message to parent window
        if (window.opener) {
          window.opener.postMessage(
            {
              type: 'GOOGLE_DRIVE_AUTH_ERROR',
              error,
            },
            window.location.origin,
          );
        }

        window.close();
        return;
      }

      if (code) {
        // Send success message with code to parent window
        if (window.opener) {
          console.log('GOOGLE_DRIVE_AUTH_SUCCESS', code, state);
          console.log('GOOGLE_DRIVE_AUTH_SUCCESS[b]', window.opener);
          fetchAPI(`googledrive/callback?code=${code}&state=${state}`);
          window.opener.postMessage(
            {
              type: 'GOOGLE_DRIVE_AUTH_SUCCESS',
              code,
              state,
            },
            window.location.origin,
          );
        }

        // window.close();
        return;
      }

      // If no code or error, something went wrong
      console.error('No authorization code received');

      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'GOOGLE_DRIVE_AUTH_ERROR',
            error: 'no_code',
          },
          window.location.origin,
        );
      }

      // window.close();
    };

    // Handle callback when component mounts
    if (router.isReady) {
      handleCallback();
    }
  }, [router.isReady]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      h="100vh"
      bg="background"
      gap="md">
      <Spinner size={32} />
      <Text variant="base" color="textSecondary">
        Completing Google Drive authentication...
      </Text>
      <Text variant="sm" color="textSecondary">
        This window will close automatically.
      </Text>
    </Flex>
  );
};

export default GoogleDriveCallback;
