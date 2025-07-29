import { FC, useState, useCallback, useEffect } from 'react';
import { Box, Text, Modal, Button, InputText, Field } from '@wraft/ui';

import { Integration } from './integrationService';

interface IntegrationConfigModalProps {
  integration: Integration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: Record<string, string>) => Promise<void>;
}

export const IntegrationConfigModal: FC<IntegrationConfigModalProps> = ({
  integration,
  isOpen,
  onClose,
  onSave,
}) => {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && integration.config_structure) {
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
    } else if (!isOpen) {
      setConfig({});
      setErrors({});
    }
  }, [isOpen, integration.config_structure, integration.config]);

  const handleClose = () => {
    onClose();
  };

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
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSave(config);
    } catch (error) {
      console.error('Failed to update integration config:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      ariaLabel={`Configure ${integration.name}`}
      size="md">
      <Box p="md">
        <Modal.Header>{`Configure ${integration.name}`}</Modal.Header>
        <Text variant="base" mb="md">
          Configure your {integration.name} integration settings below.
        </Text>
        <Box display="flex" flexDirection="column" gap="md">
          {!integration.config_structure ? (
            <Text variant="base" color="textSecondary">
              No configuration required for this integration.
            </Text>
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
                    required={field.required}
                    variant={errors[key] ? 'error' : undefined}
                  />
                </Field>

                <Text fontSize="xs" color="gray.900" mt="xs">
                  {field.description}
                </Text>
              </Box>
            ))
          )}
        </Box>
        <Box display="flex" gap="md" mt="lg">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || Object.keys(errors).length > 0}>
            Save Configuration
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
