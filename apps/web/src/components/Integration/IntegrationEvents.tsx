import { FC, useState, useEffect } from 'react';
import { Box, Text, Button, Checkbox } from '@wraft/ui';
import { toast } from 'react-hot-toast';

import { Integration, integrationService } from './integrationService';

interface IntegrationEventsProps {
  integration: Integration;
  onUpdate: (updatedIntegration: Integration) => void;
}

export const IntegrationEvents: FC<IntegrationEventsProps> = ({
  integration,
  onUpdate,
}) => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedEvents(integration.selected_events || []);
  }, [integration.selected_events]);

  const handleSubmit = async () => {
    if (!integration.id) {
      toast.error('Integration must be enabled before configuring events');
      return;
    }

    try {
      setLoading(true);
      const updatedIntegration = await integrationService.updateEvents(
        integration.id,
        selectedEvents,
      );
      onUpdate(updatedIntegration);
      toast.success(`${integration.name} events have been updated`);
    } catch (error) {
      console.error('Failed to update integration events:', error);
      toast.error(`Failed to update ${integration.name} events`);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEvent = (eventId: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventId)
        ? prev.filter((id) => id !== eventId)
        : [...prev, eventId],
    );
  };

  const hasChanges = () => {
    const currentEvents = integration.selected_events || [];
    return (
      JSON.stringify(selectedEvents.sort()) !==
      JSON.stringify(currentEvents.sort())
    );
  };

  if (
    !integration.available_events ||
    integration.available_events.length === 0
  ) {
    return null;
  }

  return (
    <Box bg="background-primary" p="xl" borderRadius="md">
      <Text variant="xl" fontWeight="semibold" mb="md">
        Events
      </Text>
      <Text variant="base" color="textSecondary" mb="lg">
        Select the events you want to subscribe to for this integration.
      </Text>

      <Box display="flex" flexDirection="column" gap="md" mb="lg">
        {!integration.available_events ||
        integration.available_events.length === 0 ? (
          <Box
            p="lg"
            bg="gray.50"
            borderRadius="md"
            border="1px solid"
            borderColor="border">
            <Text variant="base" color="textSecondary">
              No events available for this integration.
            </Text>
          </Box>
        ) : (
          integration.available_events.map((event) => (
            <Box
              key={event.id}
              p="md"
              bg="background"
              borderRadius="md"
              border="1px solid"
              borderColor="border">
              <Box display="flex" alignItems="flex-start" gap="sm">
                <Checkbox
                  name={event.id}
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => handleToggleEvent(event.id)}
                  disabled={!integration.enabled}
                />
                <Box flex="1">
                  <Text variant="base" fontWeight="medium" mb="xs">
                    {event.name}
                  </Text>
                  <Text variant="sm" color="textSecondary">
                    {event.description}
                  </Text>
                </Box>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {integration.available_events &&
        integration.available_events.length > 0 && (
          <Box display="flex" gap="md">
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading || !integration.enabled || !hasChanges()}>
              Update Events
            </Button>
            {hasChanges() && (
              <Button
                variant="secondary"
                onClick={() =>
                  setSelectedEvents(integration.selected_events || [])
                }
                disabled={loading}>
                Reset
              </Button>
            )}
          </Box>
        )}

      {!integration.enabled && (
        <Box
          p="md"
          bg="yellow.50"
          borderRadius="md"
          border="1px solid"
          borderColor="yellow.200"
          mt="md">
          <Text variant="sm" color="yellow.800">
            Enable this integration first to configure events.
          </Text>
        </Box>
      )}
    </Box>
  );
};
