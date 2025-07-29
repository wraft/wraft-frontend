import { FC, useState } from 'react';
import { Box, Text, Toggle, Button } from '@wraft/ui';
import { toast } from 'react-hot-toast';

import { Integration, integrationService } from './integrationService';
import { IntegrationConfigModal } from './IntegrationConfigModal';
import { IntegrationEventsModal } from './IntegrationEventsModal';

interface IntegrationCardProps {
  integration: Integration;
  onUpdate: (updatedIntegration: Integration) => void;
}

export const IntegrationCard: FC<IntegrationCardProps> = ({
  integration,
  onUpdate,
}) => {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log('[qw] integration', integration);

  const handleToggle = async (enabled: boolean) => {
    try {
      setLoading(true);
      if (enabled && !integration.id) {
        setIsConfigModalOpen(true);
      } else if (enabled && integration.id) {
        await integrationService.enableIntegration(integration.id!);
        onUpdate({ ...integration, enabled: true });
        toast.success(`${integration.name} has been disabled`);
      } else {
        await integrationService.disableIntegration(integration.id!);
        onUpdate({ ...integration, enabled: false });
        toast.success(`${integration.name} has been disabled`);
      }
    } catch (error) {
      console.error('Failed to toggle integration:', error);
      toast.error(
        `Failed to ${enabled ? 'enable' : 'disable'} ${integration.name}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      p="md"
      borderRadius="md"
      border="1px solid"
      borderColor="border"
      bg="background">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="xs">
        <Box display="flex" alignItems="center" gap="md">
          {/* {integration.icon && (
            <Box
              as="img"
              src={integration.icon}
              alt={integration.name}
              width={32}
              height={32}
            />
          )} */}
          <Text variant="xl">{integration.name}</Text>
        </Box>
        <Toggle
          checked={integration.enabled}
          onChange={(e) => handleToggle(e.target.checked)}
          disabled={loading}
          aria-label={`Toggle ${integration.name}`}
        />
      </Box>
      <Text variant="base" color="textSecondary" mb="md">
        {integration.description}
      </Text>
      <Box display="flex" gap="xs">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsConfigModalOpen(true)}
          disabled={!integration.enabled || loading}>
          Configure
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEventsModalOpen(true)}
          disabled={!integration.enabled || loading}>
          Events
        </Button>
      </Box>
      <IntegrationConfigModal
        integration={integration}
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onSave={async (config) => {
          try {
            setLoading(true);
            let updatedIntegration: Integration;

            if (!integration.enabled) {
              updatedIntegration = await integrationService.createIntegration(
                integration.name,
                integration.provider,
                config,
              );
              toast.success(`${integration.name} has been enabled`);
            } else {
              updatedIntegration = await integrationService.updateConfig(
                integration.id!,
                config,
              );
              toast.success(
                `${integration.name} configuration has been updated`,
              );
            }

            onUpdate(updatedIntegration);
            setIsConfigModalOpen(false);
          } catch (error) {
            toast.error(
              `Failed to ${integration.enabled ? 'update' : 'enable'} ${integration.name}`,
            );
          } finally {
            setLoading(false);
          }
        }}
      />
      <IntegrationEventsModal
        integration={integration}
        isOpen={isEventsModalOpen}
        onClose={() => setIsEventsModalOpen(false)}
        onSave={async (events) => {
          try {
            setLoading(true);
            const updatedIntegration = await integrationService.updateEvents(
              integration.id!,
              events,
            );
            onUpdate(updatedIntegration);
            setIsEventsModalOpen(false);
            toast.success(`${integration.name} events have been updated`);
          } catch (error) {
            console.error('Failed to update events:', error);
            toast.error(`Failed to update ${integration.name} events`);
          } finally {
            setLoading(false);
          }
        }}
      />
    </Box>
  );
};

export default IntegrationCard;
