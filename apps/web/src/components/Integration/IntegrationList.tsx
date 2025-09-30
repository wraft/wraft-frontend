import { FC, useEffect, useState } from 'react';
import { Box, Text, Grid } from '@wraft/ui';

import { IntegrationCard } from './IntegrationCard';
import { Integration, integrationService } from './integrationService';

export const IntegrationList: FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const configs = await integrationService.getConfigs();
        setIntegrations(configs);
      } catch (err) {
        setError('Failed to load integrations');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (updatedIntegration: Integration) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.provider === updatedIntegration.provider
          ? updatedIntegration
          : integration,
      ),
    );
  };

  if (loading) {
    return <Text>Loading integrations...</Text>;
  }

  // if (error) {
  //   return <Text color="error">{error}</Text>;
  // }

  return (
    <Box>
      {integrations.length > 0 && (
        <Box>
          <Text variant="lg" fontWeight="semibold" mb="md" color="gray.1200">
            Other Integrations
          </Text>
          <Grid gridTemplateColumns="repeat(4, 1fr)" gap="lg">
            {integrations.map((integration) => (
              <IntegrationCard
                key={integration.provider}
                integration={integration}
                onUpdate={handleUpdate}
              />
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};
