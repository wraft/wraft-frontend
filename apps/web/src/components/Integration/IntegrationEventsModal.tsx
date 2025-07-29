import { FC, useState } from 'react';
import { Box, Text, Modal, Button, Checkbox } from '@wraft/ui';

import { Integration } from './integrationService';

interface IntegrationEventsModalProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (events: string[]) => Promise<void>;
}

export const IntegrationEventsModal: FC<IntegrationEventsModalProps> = ({
  integration,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedEvents, setSelectedEvents] = useState<string[]>(
    integration.selected_events,
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(selectedEvents);
    } catch (error) {
      console.error('Failed to update integration events:', error);
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

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      ariaLabel={`Manage ${integration.name} Events`}
      size="md">
      <Box p={4}>
        <Modal.Header>{`Manage ${integration.name} Events`}</Modal.Header>
        <Text variant="base" mb="md">
          Select the events you want to subscribe to.
        </Text>
        <Box display="flex" flexDirection="column" gap="md">
          {!integration.available_events ? (
            <Text variant="base" color="textSecondary">
              No events available for this integration.
            </Text>
          ) : (
            integration.available_events.map((event) => (
              <Box key={event.id}>
                <Box display="flex" alignItems="center" gap="sm">
                  <Checkbox
                    name={event.id}
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => handleToggleEvent(event.id)}
                  />
                  <Text variant="base">{event.name}</Text>
                </Box>
                <Text variant="base" color="textSecondary" ml="lg">
                  {event.description}
                </Text>
              </Box>
            ))
          )}
        </Box>
        <Box display="flex" gap="md" mt="lg">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}>
            Save Events
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
