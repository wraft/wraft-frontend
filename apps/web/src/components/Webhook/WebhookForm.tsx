import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Flex,
  Text,
  InputText,
  Field,
  Checkbox,
  Grid,
} from '@wraft/ui';
import { Plus, Trash, X } from '@phosphor-icons/react';

import { webhookApi } from 'components/Webhook/webhookApi';
import {
  WebhookSchema,
  WebhookFormData,
  WebhookResponse,
  WEBHOOK_EVENTS,
  EVENT_DESCRIPTIONS,
} from 'schemas/webhook';

interface WebhookFormProps {
  webhookId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const WebhookForm: React.FC<WebhookFormProps> = ({
  webhookId,
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!webhookId;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<WebhookFormData>({
    resolver: zodResolver(WebhookSchema),
    defaultValues: {
      name: '',
      url: '',
      events: [],
      secret: '',
      headers: [],
      retry_count: 3,
      timeout_seconds: 30,
      is_active: true,
    },
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control,
    name: 'headers',
  });

  const selectedEvents = watch('events');

  useEffect(() => {
    if (isEditMode && webhookId) {
      fetchWebhook();
    }
  }, [webhookId, isEditMode]);

  const fetchWebhook = async () => {
    try {
      setIsLoading(true);
      const webhook: WebhookResponse = await webhookApi.get(webhookId!);

      // Transform the webhook data to match form format
      const headers = webhook.headers
        ? Object.entries(webhook.headers).map(([key, value]) => ({
            key,
            value,
          }))
        : [];

      const formData: WebhookFormData = {
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        secret: '', // Secret is not returned for security reasons
        headers,
        retry_count: webhook.retry_count,
        timeout_seconds: webhook.timeout_seconds,
        is_active: webhook.is_active,
      };

      reset(formData);
    } catch (error: any) {
      console.error('Error fetching webhook:', error);
      toast.error('Failed to load webhook data');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: WebhookFormData) => {
    try {
      setIsSubmitting(true);

      if (isEditMode) {
        await webhookApi.update(webhookId!, data);
        toast.success('Webhook updated successfully');
      } else {
        await webhookApi.create(data);
        toast.success('Webhook created successfully');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving webhook:', error);
      toast.error(error?.message || 'Failed to save webhook');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventToggle = (eventKey: string) => {
    const currentEvents = selectedEvents || [];
    const isSelected = currentEvents.includes(eventKey as any);

    if (isSelected) {
      setValue(
        'events',
        currentEvents.filter((e) => e !== eventKey),
      );
    } else {
      setValue('events', [...currentEvents, eventKey as any]);
    }
  };

  const addHeader = () => {
    appendHeader({ key: '', value: '' });
  };

  if (isLoading) {
    return (
      <Box p="lg">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box w="600px" h="100vh" display="flex" flexDirection="column">
      {/* Drawer Header */}
      <Flex
        px="lg"
        py="md"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="gray.200">
        <Text fontSize="lg" fontWeight="heading">
          {isEditMode ? 'Edit Webhook' : 'Create New Webhook'}
        </Text>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X size={20} />
        </Button>
      </Flex>

      {/* Form Content */}
      <Box flex="1" overflow="auto" p="lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="md">
            {/* Basic Information */}
            <Field label="Name" error={errors.name?.message} required>
              <InputText
                {...register('name')}
                placeholder="Enter webhook name"
              />
            </Field>

            <Field label="Webhook URL" error={errors.url?.message} required>
              <InputText
                {...register('url')}
                placeholder="https://your-endpoint.com/webhook"
                autoComplete="off"
              />
            </Field>

            {/* Section Divider */}
            <Box borderTop="1px solid" borderColor="border" my="md" />

            {/* Event Selection */}
            <Box>
              <Text fontWeight="heading" mb="sm" display="flex" gap="xs">
                Events{' '}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>
              <Text fontSize="sm" color="gray.800" mb="md">
                Select which events should trigger this webhook
              </Text>
              {errors.events && (
                <Text color="red.500" fontSize="sm" mb="sm">
                  {errors.events.message}
                </Text>
              )}

              <Grid templateColumns="1fr" gap="sm">
                {WEBHOOK_EVENTS.map((event) => (
                  <Box
                    key={event}
                    p="md"
                    border="1px solid"
                    borderColor={
                      selectedEvents?.includes(event) ? 'green.600' : 'border'
                    }
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => handleEventToggle(event)}
                    bg={selectedEvents?.includes(event) ? 'blue.50' : 'white'}>
                    <Flex alignItems="flex-start" gap="sm">
                      <Checkbox
                        checked={selectedEvents?.includes(event) || false}
                        onChange={() => handleEventToggle(event)}
                      />
                      <Box>
                        <Text fontWeight="medium" fontSize="sm">
                          {event}
                        </Text>
                        <Text fontSize="xs" color="text-secondary">
                          {EVENT_DESCRIPTIONS[event]}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Grid>
            </Box>

            {/* Section Divider */}
            <Box borderTop="1px solid" borderColor="border" my="md" />

            {/* Configuration */}
            <Box>
              <Text fontWeight="heading" mb="md">
                Configuration
              </Text>

              <Flex direction="column" gap="md">
                <Field label="Secret" error={errors.secret?.message}>
                  <InputText
                    {...register('secret')}
                    type="password"
                    placeholder="Optional webhook secret for authentication"
                    autocomplete="new-password"
                  />
                </Field>

                <Flex gap="md">
                  <Field
                    label="Retry Count"
                    error={errors.retry_count?.message}>
                    <InputText
                      {...register('retry_count', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="10"
                    />
                  </Field>

                  <Field
                    label="Timeout (seconds)"
                    error={errors.timeout_seconds?.message}>
                    <InputText
                      {...register('timeout_seconds', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="300"
                    />
                  </Field>
                </Flex>

                <Flex alignItems="center" gap="sm">
                  <Checkbox {...register('is_active')} />
                  <Box>
                    <Text>Active</Text>
                    <Text fontSize="sm" color="gray.600">
                      When enabled, this webhook will receive event
                      notifications
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Box>

            {/* Section Divider */}
            <Box borderTop="1px solid" borderColor="border" my="md" />

            {/* Custom Headers */}
            <Box>
              <Flex alignItems="center" justifyContent="space-between" mb="md">
                <Text fontWeight="heading">Custom Headers</Text>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={addHeader}>
                  <Plus size={16} />
                  Add Header
                </Button>
              </Flex>

              {headerFields.map((field, index) => (
                <Flex key={field.id} gap="sm" mb="sm" alignItems="end">
                  <Box flex="1">
                    <Field error={errors.headers?.[index]?.key?.message}>
                      <InputText
                        {...register(`headers.${index}.key`)}
                        placeholder="Header name"
                      />
                    </Field>
                  </Box>
                  <Box flex="1">
                    <Field error={errors.headers?.[index]?.value?.message}>
                      <InputText
                        {...register(`headers.${index}.value`)}
                        placeholder="Header value"
                      />
                    </Field>
                  </Box>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeHeader(index)}>
                    <Trash size={16} />
                  </Button>
                </Flex>
              ))}
            </Box>
          </Flex>
        </form>
      </Box>

      {/* Drawer Footer */}
      <Box
        px="lg"
        py="md"
        borderTop="1px solid"
        borderColor="gray.200"
        bg="gray.50">
        <Flex gap="sm" justifyContent="flex-end">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}>
            {isEditMode ? 'Update Webhook' : 'Create Webhook'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default WebhookForm;
