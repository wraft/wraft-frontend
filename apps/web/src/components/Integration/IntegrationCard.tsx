import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Flex, Text, Toggle, Button } from '@wraft/ui';
import { toast } from 'react-hot-toast';

import { Integration, integrationService } from './integrationService';

interface IntegrationCardProps {
  integration: Integration;
  onUpdate: (updatedIntegration: Integration) => void;
}

export const IntegrationCard: FC<IntegrationCardProps> = ({
  integration,
  onUpdate,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async (enabled: boolean) => {
    try {
      setLoading(true);
      if (enabled && !integration.id) {
        router.push(`/manage/integrations/${integration.provider}`);
      } else if (enabled && integration.id) {
        await integrationService.enableIntegration(integration.id!);
        onUpdate({ ...integration, enabled: true });
        toast.success(`${integration.name} has been enabled`);
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

  const handleConfigure = () => {
    router.push(`/manage/integrations/${integration.provider}`);
  };

  return (
    <Box
      p="md"
      borderRadius="md"
      border="1px solid"
      borderColor="border"
      bg="background">
      <Box h="110px">
        <Box
          bg="gray.500"
          w={32}
          h={32}
          borderRadius="md"
          borderColor="border"
        />
        <Box display="flex" alignItems="center" gap="md" mt="sm">
          <Text fontSize="xl" fontWeight="heading">
            {integration.name}
          </Text>
        </Box>
        <Text color="text-secondary" mb="md" mt="sm" lines={2}>
          {integration.description}
        </Text>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="xs"></Box>

      <Flex
        align="center"
        justifyContent="space-between"
        gap="xs"
        borderTop="1px solid"
        borderColor="border"
        pt="md">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleConfigure}
          disabled={loading}>
          Configure
        </Button>
        <Flex align="center" gap="xs">
          <Text>{integration.enabled ? 'Enabled' : 'Disabled'}</Text>
          <Toggle
            checked={integration.enabled}
            onChange={(e) => handleToggle(e.target.checked)}
            disabled={loading}
            aria-label={`Toggle ${integration.name}`}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default IntegrationCard;
