import { FC, useState, useCallback, useEffect } from 'react';
import { Box, Text, Button, InputText, Field } from '@wraft/ui';
import { toast } from 'react-hot-toast';

import { Integration, integrationService } from './integrationService';

interface IntegrationConfigProps {
  integration: Integration;
  onUpdate: (updatedIntegration: Integration) => void;
}

export const IntegrationConfig: FC<IntegrationConfigProps> = ({
  integration,
  onUpdate,
}) => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (integration.config_structure) {
      const existingConfig: Record<string, string> = {};

      if (integration.config) {
        Object.entries(integration.config).forEach(([key, value]) => {
          if (value && typeof value === 'string') {
            existingConfig[key] = value;
          }
        });
      } else {
        Object.entries(integration.config_structure).forEach(([key, field]) => {
          if (field.value && typeof field.value === 'string') {
            existingConfig[key] = field.value;
          }
        });
      }

      setConfig(existingConfig);
      setErrors({});
    }
  }, [integration.config_structure, integration.config]);

  const validateField = useCallback(
    (key: string, value: string) => {
      if (!integration.config_structure) return '';
      const field = integration.config_structure[key];
      if (field?.required && !value) {
        return `${field.label} is required`;
      }
      return '';
    },
    [integration.config_structure],
  );

  const validateForm = useCallback(() => {
    if (!integration.config_structure) return true;

    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(integration.config_structure).forEach(([key, _field]) => {
      const error = validateField(key, config[key] || '');
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [config, integration.config_structure, validateField]);

  const handleSubmit = async () => {
    console.log('ddd', validateForm());
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      let updatedIntegration: Integration;

      if (!integration.config || Object.keys(integration.config).length === 0) {
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
        toast.success(`${integration.name} configuration has been updated`);
      }

      onUpdate(updatedIntegration);
    } catch (error) {
      console.error('Failed to update integration config:', error);
      toast.error(
        `Failed to ${integration.enabled ? 'update' : 'enable'} ${integration.name}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg="background-primary" p="xl" borderRadius="md">
      <Text variant="xl" fontWeight="semibold" mb="md">
        Configuration
      </Text>
      <Text variant="base" color="textSecondary" mb="lg">
        Configure your {integration.name} integration settings below.
      </Text>

      <Box display="flex" flexDirection="column" gap="md" mb="lg">
        {!integration.config_structure ? (
          <Box
            p="lg"
            bg="gray.50"
            borderRadius="md"
            border="1px solid"
            borderColor="border">
            <Text variant="base" color="textSecondary">
              No configuration required for this integration.
            </Text>
          </Box>
        ) : (
          Object.entries(integration.config_structure).map(([key, field]) => (
            <Box key={key}>
              <Field
                label={field.label}
                required={field.required}
                error={errors[key]}>
                <InputText
                  name={key}
                  type={field.secret ? 'password' : 'text'}
                  placeholder={field.description}
                  value={config[key] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setConfig((prev) => ({
                      ...prev,
                      [key]: value,
                    }));
                    if (errors[key]) {
                      setErrors((prev) => ({
                        ...prev,
                        [key]: '',
                      }));
                    }
                  }}
                  onBlur={() => {
                    const error = validateField(key, config[key] || '');
                    if (error) {
                      setErrors((prev) => ({
                        ...prev,
                        [key]: error,
                      }));
                    }
                  }}
                />
              </Field>

              <Text fontSize="xs" color="gray.900" mt="xs">
                {field.description}
              </Text>
            </Box>
          ))
        )}
      </Box>

      {integration.config_structure && (
        <Box display="flex" gap="md">
          <Button
            variant={
              integration.config && Object.keys(integration.config).length > 0
                ? 'secondary'
                : 'primary'
            }
            onClick={handleSubmit}
            loading={loading}>
            {integration.config && Object.keys(integration.config).length > 0
              ? 'Update Configuration'
              : 'Enable Integration'}
          </Button>
        </Box>
      )}
    </Box>
  );
};
