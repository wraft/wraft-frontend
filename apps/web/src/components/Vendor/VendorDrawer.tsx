import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Flex,
  Text,
  Button,
  InputText,
  Textarea,
  Field,
  Spinner,
  Drawer,
} from '@wraft/ui';
import { XIcon, CheckIcon } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { vendorService } from 'components/Vendor/vendorService';
import { VendorForm as VendorFormType, VendorFormSchema } from 'schemas/vendor';

interface VendorDrawerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  vendorId?: string;
  isEdit?: boolean;
  onSuccess?: () => void;
}

const VendorDrawer: React.FC<VendorDrawerProps> = ({
  isOpen,
  setIsOpen,
  vendorId,
  isEdit = false,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm<VendorFormType>({
    resolver: zodResolver(VendorFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      website: '',
      registration_number: '',
      contact_person: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && vendorId) {
        loadVendorData();
      } else {
        reset();
      }
    }
  }, [isOpen, isEdit, vendorId]);

  const loadVendorData = async () => {
    if (!vendorId) return;

    try {
      setLoading(true);
      const vendor = await vendorService.getVendor(vendorId);

      Object.keys(vendor).forEach((key) => {
        if (
          key !== 'id' &&
          key !== 'created_at' &&
          key !== 'updated_at' &&
          key !== 'logo_url' &&
          key !== 'contacts_count'
        ) {
          const value = vendor[key as keyof typeof vendor];
          setValue(
            key as keyof VendorFormType,
            typeof value === 'string' ? value : '',
          );
        }
      });
    } catch (error) {
      console.error('Error loading vendor:', error);
      toast.error('Failed to load vendor data');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: VendorFormType) => {
    try {
      setLoading(true);

      if (isEdit && vendorId) {
        await vendorService.updateVendor(vendorId, data);

        toast.success('Vendor updated successfully');
        onSuccess?.();
        setIsOpen(false);
      } else {
        await vendorService.createVendor(data);

        toast.success('Vendor created successfully');
        onSuccess?.();
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error saving vendor:', error);
      toast.error(
        isEdit ? 'Failed to update vendor' : 'Failed to create vendor',
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsOpen(false);
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size={32} />
      </Flex>
    );
  }

  return (
    <Flex
      as="form"
      h="100vh"
      direction="column"
      onSubmit={handleSubmit(onSubmit)}>
      <Box flexShrink="0">
        <Drawer.Header>
          <Drawer.Title>
            {isEdit ? 'Edit Vendor' : 'Create Vendor'}
          </Drawer.Title>
          <XIcon
            size={20}
            weight="bold"
            cursor="pointer"
            onClick={handleCancel}
          />
        </Drawer.Header>
      </Box>

      <Flex
        borderTop="1px solid"
        borderColor="border"
        flex="1"
        direction="column"
        overflow="auto"
        p="xl">
        <Box mb="lg">
          <Field label="Vendor Name" error={errors.name?.message} required>
            <InputText
              {...register('name')}
              placeholder="Enter vendor name"
              mb="md"
            />
          </Field>

          <Field label="Contact Person" error={errors.contact_person?.message}>
            <InputText
              {...register('contact_person')}
              placeholder="Enter contact person name"
              mb="md"
            />
          </Field>

          <Field label="Email" error={errors.email?.message}>
            <InputText
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              mb="md"
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <InputText
              {...register('phone')}
              placeholder="Enter phone number"
              mb="md"
            />
          </Field>

          <Field label="Website" error={errors.website?.message}>
            <InputText
              {...register('website')}
              placeholder="Enter website URL"
            />
          </Field>
        </Box>

        <Box mb="lg">
          <Text variant="lg" fontWeight="600" mb="md">
            Address Information
          </Text>

          <Field label="Address" error={errors.address?.message} required>
            <Textarea
              {...register('address')}
              placeholder="Enter complete address"
              rows={3}
              mb="md"
            />
          </Field>

          <Field label="City" error={errors.city?.message}>
            <InputText {...register('city')} placeholder="Enter city" mb="md" />
          </Field>

          <Field label="Country" error={errors.country?.message}>
            <InputText {...register('country')} placeholder="Enter country" />
          </Field>
        </Box>

        <Box mb="lg">
          <Text variant="lg" fontWeight="600" mb="md">
            Business Information
          </Text>

          <Field
            label="Registration Number"
            error={errors.registration_number?.message}>
            <InputText
              {...register('registration_number')}
              placeholder="Enter registration number"
            />
          </Field>
        </Box>
      </Flex>

      <Box flexShrink="0" borderTop="1px solid" borderColor="border" p="xl">
        <Flex gap="md" justify="flex-end">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? <Spinner size={16} /> : <CheckIcon size={16} />}
            {isEdit ? 'Update Vendor' : 'Create Vendor'}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default VendorDrawer;
