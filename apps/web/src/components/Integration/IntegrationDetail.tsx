import { FC, useEffect, useRef, useState } from 'react';
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
  const popupCloseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const oauthTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageListenerRef = useRef<((event: MessageEvent) => void) | null>(
    null,
  );

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

  const cleanupOAuthListeners = () => {
    if (messageListenerRef.current) {
      window.removeEventListener('message', messageListenerRef.current);
      messageListenerRef.current = null;
    }
    if (popupCloseIntervalRef.current) {
      clearInterval(popupCloseIntervalRef.current);
      popupCloseIntervalRef.current = null;
    }
    if (oauthTimeoutRef.current) {
      clearTimeout(oauthTimeoutRef.current);
      oauthTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      cleanupOAuthListeners();
    };
  }, []);

  const handleConnect = async () => {
    setToggleLoading(true);

    try {
      cleanupOAuthListeners();
      const res = (await fetchAPI('auth/google_drive')) as {
        redirect_url: string;
      };
      const { redirect_url } = res;

      const popup = window.open(
        redirect_url,
        'google-drive-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes',
      );

      if (!popup) {
        toast.error('Popup was blocked. Please allow popups and try again.');
        setToggleLoading(false);
        return;
      }

      const messageListener = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin || event.source !== popup) {
          return;
        }

        if (event.data.type === 'GOOGLE_DRIVE_AUTH_SUCCESS') {
          const code =
            typeof event.data.code === 'string' ? event.data.code : '';
          const state =
            typeof event.data.state === 'string' ? event.data.state : '';

          if (!code) {
            toast.error('Missing authorization code from Google Drive');
            cleanupOAuthListeners();
            setToggleLoading(false);
            popup.close();
            return;
          }

          try {
            const params = new URLSearchParams({ code, state });
            await fetchAPI(`googledrive/callback?${params.toString()}`);
            toast.success('Successfully connected to Google Drive!');
          } catch (authError) {
            console.error('Error handling OAuth callback:', authError);
            toast.error('Failed to connect to Google Drive');
          }
        } else if (event.data.type === 'GOOGLE_DRIVE_AUTH_ERROR') {
          toast.error('Authentication was cancelled or failed');
        }

        cleanupOAuthListeners();
        setToggleLoading(false);
        popup.close();
      };

      messageListenerRef.current = messageListener;
      window.addEventListener('message', messageListener);

      popupCloseIntervalRef.current = setInterval(() => {
        if (popup.closed) {
          cleanupOAuthListeners();
          setToggleLoading(false);
        }
      }, 1000);
      oauthTimeoutRef.current = setTimeout(() => {
        cleanupOAuthListeners();
        if (!popup.closed) {
          popup.close();
        }
        setToggleLoading(false);
        toast.error('Google Drive authentication timed out. Please try again.');
      }, 120000);
    } catch (initError: any) {
      console.error('Error initiating OAuth:', initError);
      toast.error('Failed to initiate Google Drive authentication');
      cleanupOAuthListeners();
      setToggleLoading(false);
    }
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
