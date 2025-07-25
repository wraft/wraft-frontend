import { useState, useEffect } from 'react';
import { Box, Flex, Text, Button, InputText, Modal, Spinner } from '@wraft/ui';
import {
  User,
  Envelope,
  Phone,
  Briefcase,
  Check,
  X,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { vendorContactService } from 'components/Vendor/vendorService';
import {
  VendorContactResponse,
  VendorContactFormSchema,
  VendorContactFormType,
} from 'schemas/vendor';

interface VendorContactFormProps {
  open: boolean;
  onClose: () => void;
  contact?: VendorContactResponse | null;
  vendorId: string;
  onSuccess: () => void;
}

const VendorContactForm: React.FC<VendorContactFormProps> = ({
  open,
  onClose,
  contact,
  vendorId,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VendorContactFormType>({
    resolver: zodResolver(VendorContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      job_title: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (contact) {
        reset({
          name: contact.name,
          email: contact.email || '',
          phone: contact.phone || '',
          job_title: contact.job_title || '',
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          job_title: '',
        });
      }
    }
  }, [open, contact, reset]);

  const onSubmit = async (data: VendorContactFormType) => {
    try {
      setLoading(true);

      if (contact?.id) {
        await vendorContactService.updateVendorContact(
          vendorId,
          contact.id,
          data,
        );
        toast.success('Contact updated successfully');
      } else {
        await vendorContactService.createVendorContact(vendorId, {
          ...data,
          vendor_id: vendorId,
        });
        toast.success('Contact added successfully');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error(
        contact?.id ? 'Failed to update contact' : 'Failed to add contact',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      ariaLabel={contact?.id ? 'Edit Contact' : 'Add Contact'}>
      <Box p="lg">
        <Flex align="center" justify="space-between" mb="lg">
          <Text variant="lg" fontWeight="600">
            {contact?.id ? 'Edit Contact' : 'Add Contact'}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            title="Close">
            <X size={16} />
          </Button>
        </Flex>

        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Box mb="md">
            <Flex align="center" gap="sm" mb="xs">
              <User size={16} />
              <Text fontWeight="500">Name *</Text>
            </Flex>
            <InputText placeholder="Enter contact name" {...register('name')} />
            {errors.name && (
              <Text color="red.500" fontSize="sm" mt="xs">
                {errors.name.message}
              </Text>
            )}
          </Box>

          <Box mb="md">
            <Flex align="center" gap="sm" mb="xs">
              <Briefcase size={16} />
              <Text fontWeight="500">Job Title</Text>
            </Flex>
            <InputText
              placeholder="Enter job title"
              {...register('job_title')}
            />
            {errors.job_title && (
              <Text color="red.500" fontSize="sm" mt="xs">
                {errors.job_title.message}
              </Text>
            )}
          </Box>

          <Box mb="md">
            <Flex align="center" gap="sm" mb="xs">
              <Envelope size={16} />
              <Text fontWeight="500">Email</Text>
            </Flex>
            <InputText
              type="email"
              placeholder="Enter email address"
              {...register('email')}
            />
            {errors.email && (
              <Text color="red.500" fontSize="sm" mt="xs">
                {errors.email.message}
              </Text>
            )}
          </Box>

          <Box mb="lg">
            <Flex align="center" gap="sm" mb="xs">
              <Phone size={16} />
              <Text fontWeight="500">Phone</Text>
            </Flex>
            <InputText
              placeholder="Enter phone number"
              {...register('phone')}
            />
            {errors.phone && (
              <Text color="red.500" fontSize="sm" mt="xs">
                {errors.phone.message}
              </Text>
            )}
          </Box>

          <Flex
            gap="md"
            justify="end"
            pt="md"
            borderTop="1px solid"
            borderColor="border">
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              {loading ? (
                <>
                  <Spinner size={16} />
                  {contact?.id ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  <Check size={16} />
                  {contact?.id ? 'Update Contact' : 'Add Contact'}
                </>
              )}
            </Button>
          </Flex>
        </Box>
      </Box>
    </Modal>
  );
};

export default VendorContactForm;
