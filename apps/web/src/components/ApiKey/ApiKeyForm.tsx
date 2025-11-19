import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Flex,
  Text,
  InputText,
  Field,
  Modal,
  Drawer,
} from '@wraft/ui';
import {
  XIcon,
  CopyIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
} from '@phosphor-icons/react';

import {
  ApiKeyFormSchema,
  ApiKeyFormData,
  ApiKeyResponse,
} from 'schemas/apiKey';

import { apiKeyService } from './apiKeyService';

interface ApiKeyFormProps {
  apiKeyId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
  apiKeyId,
  onSuccess,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isEditMode = !!apiKeyId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ApiKeyFormSchema),
    defaultValues: {
      name: '',
      rate_limit: 1000,
      expires_at: '',
      ip_whitelist: [],
      metadata: {},
    },
  });

  const [ipInput, setIpInput] = useState('');
  const watchedIpWhitelist = watch('ip_whitelist') || [];

  useEffect(() => {
    if (isEditMode && apiKeyId) {
      fetchApiKey();
    }
  }, [apiKeyId, isEditMode]);

  const fetchApiKey = async () => {
    try {
      setIsLoading(true);
      const apiKey: ApiKeyResponse = await apiKeyService.get(apiKeyId!);

      let formattedExpiresAt = '';
      if (apiKey.expires_at) {
        const date = new Date(apiKey.expires_at);
        formattedExpiresAt = date.toISOString().slice(0, 16);
      }

      reset({
        name: apiKey.name,
        rate_limit: apiKey.rate_limit,
        expires_at: formattedExpiresAt,
        ip_whitelist: apiKey.ip_whitelist || [],
        metadata: apiKey.metadata || {},
      });
    } catch (error: any) {
      toast.error(error?.message?.errors || 'Failed to load API key');
      onCancel?.();
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ApiKeyFormData) => {
    try {
      setIsSubmitting(true);

      const submitData = { ...data };
      if (submitData.expires_at && submitData.expires_at !== '') {
        const date = new Date(submitData.expires_at);
        submitData.expires_at = date.toISOString();
      }

      if (isEditMode) {
        await apiKeyService.update(apiKeyId!, submitData);
        toast.success('API key updated successfully');
        onSuccess?.();
      } else {
        const response = await apiKeyService.create(submitData);
        if (response.key) {
          setCreatedApiKey(response.key);
          setShowSuccessModal(true);
        } else {
          toast.success('API key created successfully');
          onSuccess?.();
        }
      }
    } catch (error: any) {
      const errorMessage =
        error?.errors ||
        error?.message?.errors ||
        `Failed to ${isEditMode ? 'update' : 'create'} API key`;
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = () => {
    if (createdApiKey) {
      navigator.clipboard.writeText(createdApiKey);
      toast.success('API key copied to clipboard');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setCreatedApiKey(null);
    onSuccess?.();
  };

  const handleAddIp = () => {
    if (ipInput.trim()) {
      const current = watchedIpWhitelist;
      if (!current.includes(ipInput.trim())) {
        setValue('ip_whitelist', [...current, ipInput.trim()]);
        setIpInput('');
      } else {
        toast.error('IP address already added');
      }
    }
  };

  const handleRemoveIp = (ip: string) => {
    setValue(
      'ip_whitelist',
      watchedIpWhitelist.filter((i) => i !== ip),
    );
  };

  if (isLoading) {
    return (
      <Box p="lg">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <>
      <Flex
        as="form"
        h="100vh"
        direction="column"
        w="560px"
        onSubmit={handleSubmit(onSubmit)}>
        <Box flexShrink="0">
          <Drawer.Header>
            <Drawer.Title>
              {isEditMode ? 'Edit API Key' : 'Create New API Key'}
            </Drawer.Title>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <XIcon size={20} />
            </Button>
          </Drawer.Header>
        </Box>

        {!isEditMode && (
          <Box
            mx="xl"
            p="md"
            mb="lg"
            bg="blue.100"
            border="1px solid blue.300"
            borderRadius="lg">
            <Flex alignItems="start" gap="sm">
              <InfoIcon size={20} weight="fill" />
              <Text fontSize="sm">
                The API key will only be shown once after creation. Make sure to
                save it securely before closing this form.
              </Text>
            </Flex>
          </Box>
        )}

        <Flex direction="column" gap="lg" px="xl" pb="md" flex={1}>
          <Flex direction="column" gap="lg">
            <Box>
              <Field
                label="Name"
                required
                error={errors.name?.message}
                hint="A descriptive name for this API key">
                <InputText
                  {...register('name')}
                  placeholder="e.g., Salesforce Integration"
                />
              </Field>
            </Box>

            <Box>
              <Field
                label="Rate Limit (requests per hour)"
                required
                error={errors.rate_limit?.message}
                hint="Maximum number of requests allowed per hour">
                <InputText
                  type="number"
                  {...register('rate_limit', { valueAsNumber: true })}
                  placeholder="1000"
                />
              </Field>
            </Box>

            <Box>
              <Field
                label="Expiration Date"
                error={errors.expires_at?.message}
                hint="Optional expiration date for this API key">
                <InputText
                  type="datetime-local"
                  {...register('expires_at')}
                  placeholder="Select expiration date"
                />
              </Field>
            </Box>

            <Box>
              <Text fontWeight="medium" mb="sm">
                IP Whitelist
              </Text>
              <Text fontSize="sm" color="text-secondary" mb="md">
                Restrict API key usage to specific IP addresses. Leave empty to
                allow all IPs.
              </Text>
              <Flex gap="sm" mb="sm">
                <InputText
                  value={ipInput}
                  size="sm"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setIpInput(e.target.value)
                  }
                  placeholder="e.g., 192.168.1.1"
                  onKeyPress={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddIp();
                    }
                  }}
                />
                <Button type="button" size="sm" onClick={handleAddIp}>
                  Add
                </Button>
              </Flex>
              {watchedIpWhitelist.length > 0 && (
                <Flex direction="column" gap="xs">
                  {watchedIpWhitelist.map((ip) => (
                    <Flex
                      key={ip}
                      justifyContent="space-between"
                      alignItems="center"
                      p="sm"
                      bg="gray.100"
                      borderRadius="md">
                      <Text fontSize="sm">{ip}</Text>
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        onClick={() => handleRemoveIp(ip)}>
                        <XIcon size={14} />
                      </Button>
                    </Flex>
                  ))}
                </Flex>
              )}
            </Box>
          </Flex>
        </Flex>
        <Flex flexShrink="0" px="xl" py="md" gap="sm">
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}>
            {isEditMode ? 'Update API Key' : 'Create API Key'}
          </Button>
        </Flex>
      </Flex>

      <Modal
        open={showSuccessModal}
        onClose={handleSuccessModalClose}
        size="md"
        ariaLabel="API Key Created">
        <Box p="lg">
          <Flex alignItems="center" gap="md" mb="lg">
            <CheckCircleIcon size={32} weight="fill" color="green" />
            <Text fontSize="xl" fontWeight="heading">
              API Key Created Successfully
            </Text>
          </Flex>

          <Box
            mb="lg"
            p="md"
            bg="orange.100"
            border="1px solid orange.300"
            borderRadius="lg">
            <Flex alignItems="start" gap="sm">
              <WarningIcon size={20} weight="fill" />
              <Box>
                <Text fontSize="sm" fontWeight="medium">
                  Important: Save this API key now!
                </Text>
                <Text fontSize="sm" mt="xs">
                  This is the only time you&apos;ll see the full API key. Store
                  it securely - you won&apos;t be able to retrieve it later.
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box
            p="md"
            mb="lg"
            border="1px solid gray.400"
            borderRadius="lg"
            bg="background-secondary">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap="md"
              mb="sm">
              <Text fontWeight="medium">Your API Key:</Text>
              <Button size="sm" variant="secondary" onClick={handleCopyKey}>
                <CopyIcon size={14} />
                Copy
              </Button>
            </Flex>
            <Box p="sm" borderRadius="md">
              <Text>{createdApiKey}</Text>
            </Box>
          </Box>

          <Box
            mb="lg"
            p="md"
            border="1px solid blue.300"
            borderRadius="lg"
            bg="background-primary">
            <Flex alignItems="start" gap="sm">
              <InfoIcon size={20} weight="fill" />
              <Box flex={1}>
                <Text>
                  Use this key in your API requests by adding the header:
                </Text>
                <Box mt="sm" p="sm" borderRadius="md" fontFamily="monospace">
                  <Text fontSize="sm">X-API-Key: {createdApiKey}</Text>
                </Box>
              </Box>
            </Flex>
          </Box>

          <Flex justifyContent="flex-end">
            <Button variant="primary" onClick={handleSuccessModalClose}>
              I&apos;ve Saved the Key
            </Button>
          </Flex>
        </Box>
      </Modal>
    </>
  );
};

export default ApiKeyForm;
