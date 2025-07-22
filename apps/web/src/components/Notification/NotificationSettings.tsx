import React, { useEffect, useState } from 'react';
import { Box, Text, Toggle, Flex, Spinner } from '@wraft/ui';

import { fetchAPI, putAPI } from '../../utils/models';

interface NotificationEvent {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface NotificationEventResponse {
  description: string;
  event: string;
}

const NotificationSettings: React.FC = () => {
  const [events, setEvents] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotificationEvents();
    fetchCurrentSettings();
  }, []);

  const fetchNotificationEvents = async () => {
    try {
      const response = (await fetchAPI(
        'notifications/events',
      )) as NotificationEventResponse[];
      const formattedEvents = response.map((eventData) => ({
        id: eventData.event,
        name: formatEventName(eventData.event),
        description: eventData.description,
        enabled: true,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching notification events:', error);
    }
  };

  const fetchCurrentSettings = async () => {
    try {
      const response = (await fetchAPI('notifications/settings')) as string[];
      const enabledEvents = response || [];

      if (enabledEvents.length === 0) {
        setEvents((prev) =>
          prev.map((event) => ({
            ...event,
            enabled: true,
          })),
        );
      } else {
        setEvents((prev) =>
          prev.map((event) => ({
            ...event,
            enabled: !enabledEvents.includes(event.id),
          })),
        );
      }
    } catch (error) {
      console.error('Error fetching current settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (eventId: string) => {
    setSaving(true);
    try {
      const updatedEvents = events.map((event) =>
        event.id === eventId ? { ...event, enabled: !event.enabled } : event,
      );

      setEvents(updatedEvents);

      const enabledEvents = updatedEvents
        .filter((event) => !event.enabled)
        .map((event) => event.id);

      await putAPI('notifications/settings', { events: enabledEvents });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, enabled: !event.enabled } : event,
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  const formatEventName = (event: string): string => {
    return event
      .split('.')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size={32} />
      </Flex>
    );
  }

  const groupedEvents = events.reduce(
    (acc, event) => {
      const category = event.id.split('.')[0];
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(event);
      return acc;
    },
    {} as Record<string, NotificationEvent[]>,
  );

  return (
    <Box p="lg" w="60%">
      <Text fontSize="xl" fontWeight="bold" mb="xs">
        Notification Settings
      </Text>
      <Text color="text-secondary" mb="xl">
        Choose which notifications you want to receive
      </Text>

      <Flex direction="column" gap="xl">
        {Object.entries(groupedEvents).map(([category, categoryEvents]) => (
          <Box key={category}>
            <Text
              fontSize="md"
              fontWeight="bold"
              mb="md"
              textTransform="capitalize">
              {category} Notifications
            </Text>
            <Flex direction="column" bg="background-primary">
              {categoryEvents.map((event) => (
                <Flex
                  key={event.id}
                  justify="space-between"
                  align="center"
                  px="lg"
                  py="lg"
                  borderBottom="1px solid"
                  borderColor="border">
                  <Box flex={1}>
                    <Text fontWeight="500">{event.name}</Text>
                    <Text color="text-secondary" fontSize="sm" mt="xs">
                      {event.description}
                    </Text>
                  </Box>
                  <Toggle
                    checked={event.enabled}
                    onChange={() => handleToggle(event.id)}
                    disabled={saving}
                  />
                </Flex>
              ))}
            </Flex>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default NotificationSettings;
