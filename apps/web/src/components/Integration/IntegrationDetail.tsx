import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text, Flex, Toggle, Button } from '@wraft/ui';
import { toast } from 'react-hot-toast';

import { fetchAPI } from 'utils/models';

import { Integration, integrationService } from './integrationService';
import { IntegrationConfig } from './IntegrationConfig';
import { IntegrationEvents } from './IntegrationEvents';

interface IntegrationDetailProps {
  integrationId: string;
}

export const IntegrationDetail: FC<IntegrationDetailProps> = ({
  integrationId,
}) => {
  const router = useRouter();
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegration();
  }, [integrationId]);

  const fetchIntegration = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get all integrations and find the one matching the provider
      const integrations = await integrationService.getConfigs();
      const foundIntegration = integrations.find(
        (int) => int.provider === integrationId || int.id === integrationId,
      );

      if (!foundIntegration) {
        setError('Integration not found');
        return;
      }

      setIntegration(foundIntegration);
    } catch (fetchError) {
      console.error('Error fetching integration:', fetchError);
      setError('Failed to load integration details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (enabled: boolean) => {
    if (!integration) return;

    try {
      setToggleLoading(true);

      if (enabled && !integration.id) {
        // Integration needs to be configured first
        toast.error('Please configure the integration first');
        return;
      } else if (enabled && integration.id) {
        await integrationService.enableIntegration(integration.id);
        setIntegration({ ...integration, enabled: true });
        toast.success(`${integration.name} has been enabled`);
      } else if (!enabled && integration.id) {
        await integrationService.disableIntegration(integration.id);
        setIntegration({ ...integration, enabled: false });
        toast.success(`${integration.name} has been disabled`);
      }
    } catch (toggleError) {
      console.error('Failed to toggle integration:', toggleError);
      toast.error(
        `Failed to ${enabled ? 'enable' : 'disable'} ${integration.name}`,
      );
    } finally {
      setToggleLoading(false);
    }
  };

  const handleUpdate = (updatedIntegration: Integration) => {
    setIntegration(updatedIntegration);
  };

  const handleConnect = async () => {
    setToggleLoading(true);

    try {
      fetchAPI('auth/google_drive').then((res: any) => {
        const { redirect_url } = res;

        const popup = window.open(
          redirect_url,
          'google-drive-auth',
          'width=500,height=600,scrollbars=yes,resizable=yes',
        );

        // Listen for popup messages
        const messageListener = async (event: MessageEvent) => {
          console.log('GOOGLE_DRIVE_AUTH_SUCCESS', event);
          console.log('GOOGLE_DRIVE_AUTH_SUCCESS[origin]', event.origin);
          console.log(
            'GOOGLE_DRIVE_AUTH_SUCCESS[window.location]',
            window.location.origin,
          );
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.data.type === 'GOOGLE_DRIVE_AUTH_SUCCESS') {
            const { code, state } = event.data;

            console.log('GOOGLE_DRIVE_AUTH_SUCCESS');

            try {
              await fetchAPI(
                `googledrive/callback?code=${code}&state=${state}`,
              );

              toast.success('Successfully connected to Google Drive!');
              popup?.close();
            } catch (error) {
              console.error('Error handling OAuth callback:', error);
              toast.error('Failed to connect to Google Drive');
            }
          } else if (event.data.type === 'GOOGLE_DRIVE_AUTH_ERROR') {
            toast.error('Authentication was cancelled or failed');
            popup?.close();
          }

          window.removeEventListener('message', messageListener);
          setToggleLoading(false);
        };

        window.addEventListener('message', messageListener);

        // Handle popup blocked or closed
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            setToggleLoading(false);
          }
        }, 1000);
        console.log(res);
      });
    } catch (error: any) {
      console.error('Error initiating OAuth:', error);
      toast.error('Failed to initiate Google Drive authentication');
      setToggleLoading(false);
    }

    // try {
    //   const authUrl = await driveService.getAuthorizationUrl();

    //   // Open popup window for OAuth
    //   const popup = window.open(
    //     authUrl,
    //     'google-drive-auth',
    //     'width=500,height=600,scrollbars=yes,resizable=yes',
    //   );

    //   // Listen for popup messages
    //   const messageListener = async (event: MessageEvent) => {
    //     if (event.origin !== window.location.origin) {
    //       return;
    //     }

    //     if (event.data.type === 'GOOGLE_DRIVE_AUTH_SUCCESS') {
    //       const { code } = event.data;

    //       try {
    //         const result = await driveService.exchangeCodeForTokens(code);
    //         const config: GoogleDriveIntegrationConfig = {
    //           access_token: result.tokens.access_token,
    //           refresh_token: result.tokens.refresh_token,
    //           user_email: result.userInfo.email,
    //           user_name: result.userInfo.name,
    //           expires_at: result.tokens.expiry_date,
    //         };

    //         setEnabled(true);
    //         setUserInfo({
    //           email: config.user_email,
    //           name: config.user_name,
    //         });

    //         toast.success('Successfully connected to Google Drive!');
    //         popup?.close();
    //       } catch (error) {
    //         console.error('Error handling OAuth callback:', error);
    //         toast.error('Failed to connect to Google Drive');
    //       }
    //     } else if (event.data.type === 'GOOGLE_DRIVE_AUTH_ERROR') {
    //       toast.error('Authentication was cancelled or failed');
    //       popup?.close();
    //     }

    //     window.removeEventListener('message', messageListener);
    //     setToggleLoading(false);
    //   };

    //   window.addEventListener('message', messageListener);

    //   // Handle popup blocked or closed
    //   const checkClosed = setInterval(() => {
    //     if (popup?.closed) {
    //       clearInterval(checkClosed);
    //       window.removeEventListener('message', messageListener);
    //       setToggleLoading(false);
    //     }
    //   }, 1000);
    // } catch (error) {
    //   console.error('Error initiating OAuth:', error);
    //   toast.error('Failed to initiate Google Drive authentication');
    //   setToggleLoading(false);
    // }
  };

  if (loading) {
    return (
      <Box p="lg">
        <Text>Loading integration details...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="lg">
        <Text color="error" mb="md">
          {error}
        </Text>
        <Button
          variant="secondary"
          onClick={() => router.push('/manage/integrations')}>
          Back to Integrations
        </Button>
      </Box>
    );
  }

  if (!integration) {
    return (
      <Box p="lg">
        <Text color="error" mb="md">
          Integration not found
        </Text>
        <Button
          variant="secondary"
          onClick={() => router.push('/manage/integrations')}>
          Back to Integrations
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box mb="xl">
        <Flex align="center" justify="space-between" mb="md">
          <Flex align="center" gap="md">
            <Box
              w="48px"
              h="48px"
              bg="gray.500"
              borderRadius="md"
              borderColor="border"
            />
            <Box>
              <Text variant="2xl" fontWeight="heading" mb="xs">
                {integration.name}
              </Text>
              <Text color="textSecondary">{integration.description}</Text>
            </Box>
          </Flex>

          <Flex align="center" gap="md">
            <Text variant="base" fontWeight="medium">
              {integration.enabled ? 'Enabled' : 'Disabled'}
            </Text>
            <Toggle
              checked={integration.enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              disabled={toggleLoading}
              aria-label={`Toggle ${integration.name}`}
            />
          </Flex>
        </Flex>

        {integration.enabled && (
          <Box
            p="md"
            bg="green.50"
            borderRadius="md"
            border="1px solid"
            borderColor="green.200">
            <Text variant="sm" color="green.800">
              This integration is active and ready to use.
            </Text>
          </Box>
        )}
      </Box>

      {/* Configuration Section */}
      <Box mb="xl">
        <IntegrationConfig integration={integration} onUpdate={handleUpdate} />
      </Box>

      {integration.provider === 'google_drive' && (
        <Box bg="background-primary" p="xl" borderRadius="md" mb="md">
          <Text variant="base" color="textSecondary" mb="md">
            Connect your Google Drive account to enable file access and
            management features.
          </Text>
          <Button
            variant="primary"
            onClick={handleConnect}
            loading={toggleLoading}
            disabled={toggleLoading}>
            Connect Google Drive
          </Button>
        </Box>
      )}

      {/* Events Section */}
      <Box mb="xl">
        <IntegrationEvents integration={integration} onUpdate={handleUpdate} />
      </Box>

      {/* Actions */}
      <Box borderTop="1px solid" borderColor="border" pt="lg">
        <Flex gap="md">
          <Button
            variant="secondary"
            onClick={() => router.push('/manage/integrations')}>
            Back to Integrations
          </Button>

          {integration.enabled && integration.id && (
            <Button
              variant="secondary"
              onClick={() => handleToggle(false)}
              loading={toggleLoading}
              disabled={toggleLoading}>
              Disable Integration
            </Button>
          )}
        </Flex>
      </Box>
    </Box>
  );
};
