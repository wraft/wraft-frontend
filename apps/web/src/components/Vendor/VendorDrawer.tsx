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
import { Upload, X, Check } from '@phosphor-icons/react';
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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

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
      gstin: '',
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
        setLogoPreview(null);
        setLogoFile(null);
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

      if (vendor.logo_url) {
        setLogoPreview(vendor.logo_url);
      }
    } catch (error) {
      console.error('Error loading vendor:', error);
      toast.error('Failed to load vendor data');
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (targetVendorId: string) => {
    if (!logoFile) return;

    try {
      setLogoUploading(true);
      await vendorService.uploadLogo(targetVendorId, logoFile);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setLogoUploading(false);
    }
  };

  const onSubmit = async (data: VendorFormType) => {
    try {
      setLoading(true);

      if (isEdit && vendorId) {
        await vendorService.updateVendor(vendorId, data);

        if (logoFile) {
          await uploadLogo(vendorId);
        }

        toast.success('Vendor updated successfully');
        onSuccess?.();
        setIsOpen(false);
      } else {
        const newVendor = await vendorService.createVendor(data);

        if (logoFile) {
          await uploadLogo(newVendor.id);
        }

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
          <X size={20} weight="bold" cursor="pointer" onClick={handleCancel} />
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
          <Field label="Vendor Logo">
            <Flex align="center" gap="md">
              {logoPreview && (
                <Box
                  as="img"
                  src={logoPreview}
                  alt="Vendor logo"
                  w="80px"
                  h="80px"
                  borderRadius="md"
                  objectFit="cover"
                  border="1px solid"
                  borderColor="border"
                />
              )}
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: 'none' }}
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={logoUploading}>
                    {logoUploading ? (
                      <Spinner size={16} />
                    ) : (
                      <Upload size={16} />
                    )}
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                </label>
                {logoPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setLogoPreview(null);
                      setLogoFile(null);
                    }}>
                    <X size={16} />
                    Remove
                  </Button>
                )}
              </Box>
            </Flex>
          </Field>
        </Box>

        <Box mb="lg">
          <Text variant="lg" fontWeight="600" mb="md">
            Basic Information
          </Text>

          <Field label="Vendor Name" error={errors.name?.message}>
            <InputText {...register('name')} placeholder="Enter vendor name" />
          </Field>

          <Field label="Contact Person" error={errors.contact_person?.message}>
            <InputText
              {...register('contact_person')}
              placeholder="Enter contact person name"
            />
          </Field>

          <Field label="Email" error={errors.email?.message}>
            <InputText
              {...register('email')}
              type="email"
              placeholder="Enter email address"
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <InputText
              {...register('phone')}
              placeholder="Enter phone number"
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

          <Field label="Address" error={errors.address?.message}>
            <Textarea
              {...register('address')}
              placeholder="Enter complete address"
              rows={3}
            />
          </Field>

          <Field label="City" error={errors.city?.message}>
            <InputText {...register('city')} placeholder="Enter city" />
          </Field>

          <Field label="Country" error={errors.country?.message}>
            <InputText {...register('country')} placeholder="Enter country" />
          </Field>
        </Box>

        <Box mb="lg">
          <Text variant="lg" fontWeight="600" mb="md">
            Business Information
          </Text>

          <Field label="GSTIN" error={errors.gstin?.message}>
            <InputText
              {...register('gstin')}
              placeholder="Enter GSTIN number"
            />
          </Field>

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
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || logoUploading}>
            {isSubmitting ? <Spinner size={16} /> : <Check size={16} />}
            {isEdit ? 'Update Vendor' : 'Create Vendor'}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default VendorDrawer;
