import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
} from '@wraft/ui';
import { Upload, X, Check } from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { vendorService } from 'components/Vendor/vendorService';
import { VendorForm as VendorFormType, VendorFormSchema } from 'schemas/vendor';
import { usePermission } from 'utils/permissions';

interface VendorFormProps {
  vendorId?: string;
  isEdit?: boolean;
}

const VendorForm: React.FC<VendorFormProps> = ({
  vendorId,
  isEdit = false,
}) => {
  const router = useRouter();
  const { hasPermission } = usePermission();

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
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
    if (isEdit && vendorId) {
      loadVendorData();
    }
  }, [isEdit, vendorId]);

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
      router.push('/vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Logo file size must be less than 5MB');
        return;
      }

      const validTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/svg+xml',
      ];
      if (!validTypes.includes(file.type)) {
        toast.error('Logo must be a valid image file (JPEG, PNG, GIF, SVG)');
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const uploadLogo = async (vId: string) => {
    if (!logoFile) return;
    try {
      setLogoUploading(true);
      await vendorService.uploadLogo(vId, logoFile);
      toast.success('Logo uploaded successfully');
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
        router.push(`/vendors/${vendorId}`);
      } else {
        const newVendor = await vendorService.createVendor(data);

        if (logoFile) {
          await uploadLogo(newVendor.id);
        }

        toast.success('Vendor created successfully');
        router.push(`/vendors/${newVendor.id}`);
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

  const handleCancel = () => {
    router.back();
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size={32} />
      </Flex>
    );
  }

  return (
    <Box>
      <Box maxWidth="800px" mx="auto" p="lg">
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          bg="background-primary"
          borderRadius="lg"
          p="xl"
          border="1px solid"
          borderColor="border">
          <Box mb="xl">
            <Text variant="lg" fontWeight="600" mb="md">
              Company Logo
            </Text>
            <Flex gap="md" align="center">
              {logoPreview ? (
                <Box position="relative">
                  <Box
                    as="img"
                    src={logoPreview}
                    alt="Vendor logo"
                    w="80px"
                    h="80px"
                    borderRadius="md"
                    objectFit="cover"
                    border="2px solid"
                    borderColor="border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeLogo}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                    }}>
                    <X size={12} />
                  </Button>
                </Box>
              ) : (
                <Box
                  w="80px"
                  h="80px"
                  border="2px dashed"
                  borderColor="border"
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="background-secondary">
                  <Upload size={24} color="gray" />
                </Box>
              )}

              <Box flex={1}>
                <Field label="Upload Logo (Optional)">
                  <InputText
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    disabled={logoUploading}
                  />
                </Field>
                <Text variant="sm" color="text-secondary" mt="xs">
                  Supported formats: JPEG, PNG, GIF, SVG. Max size: 5MB
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box mb="xl">
            <Text variant="lg" fontWeight="600" mb="md">
              Basic Information
            </Text>

            <Flex gap="md" mb="md">
              <Box flex={1}>
                <Field
                  label="Company Name"
                  required
                  error={errors.name?.message}>
                  <InputText
                    placeholder="Enter company name"
                    {...register('name')}
                  />
                </Field>
              </Box>

              <Box flex={1}>
                <Field
                  label="Contact Person"
                  error={errors.contact_person?.message}>
                  <InputText
                    placeholder="Enter contact person name"
                    {...register('contact_person')}
                  />
                </Field>
              </Box>
            </Flex>

            <Flex gap="md" mb="md">
              <Box flex={1}>
                <Field label="Email Address" error={errors.email?.message}>
                  <InputText
                    type="email"
                    placeholder="Enter email address"
                    {...register('email')}
                  />
                </Field>
              </Box>

              <Box flex={1}>
                <Field label="Phone Number" error={errors.phone?.message}>
                  <InputText
                    placeholder="Enter phone number"
                    {...register('phone')}
                  />
                </Field>
              </Box>
            </Flex>

            <Field label="Website" error={errors.website?.message}>
              <InputText
                type="url"
                placeholder="https://example.com"
                {...register('website')}
              />
            </Field>
          </Box>

          <Box mb="xl">
            <Text variant="lg" fontWeight="600" mb="md">
              Address Information
            </Text>

            <Field label="Address" error={errors.address?.message}>
              <Textarea
                placeholder="Enter full address"
                rows={3}
                {...register('address')}
              />
            </Field>
            <Box mb="md" />

            <Flex gap="md">
              <Box flex={1}>
                <Field label="City" error={errors.city?.message}>
                  <InputText placeholder="Enter city" {...register('city')} />
                </Field>
              </Box>

              <Box flex={1}>
                <Field label="Country" error={errors.country?.message}>
                  <InputText
                    placeholder="Enter country"
                    {...register('country')}
                  />
                </Field>
              </Box>
            </Flex>
          </Box>

          <Box mb="xl">
            <Text variant="lg" fontWeight="600" mb="md">
              Business Information
            </Text>

            <Flex gap="md">
              <Box flex={1}>
                <Field
                  label="Registration Number"
                  error={errors.registration_number?.message}>
                  <InputText
                    placeholder="Enter registration number"
                    {...register('registration_number')}
                  />
                </Field>
              </Box>
            </Flex>
          </Box>

          <Flex
            gap="md"
            justify="end"
            pt="lg"
            borderTop="1px solid"
            borderColor="border">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting || logoUploading}
              disabled={
                isEdit
                  ? !hasPermission('template', 'show')
                  : !hasPermission('template', 'show')
              }>
              {isSubmitting ? (
                <>
                  <Spinner size={16} />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Check size={16} />
                  {isEdit ? 'Update Vendor' : 'Create Vendor'}
                </>
              )}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default VendorForm;
