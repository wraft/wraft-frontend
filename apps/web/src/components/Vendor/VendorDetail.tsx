import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Spinner,
  Modal,
  Pagination,
  Tab,
  useTab,
  Drawer,
  useDrawer,
  Field,
  InputText,
} from '@wraft/ui';
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeIcon,
  MapPinIcon,
  BuildingIcon,
  UserIcon,
  CalendarIcon,
  XIcon,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import {
  vendorService,
  vendorContactService,
} from 'components/Vendor/vendorService';
import { PageInner } from 'components/common/Atoms';
import {
  VendorResponse,
  VendorContactResponse,
  VendorContactFormSchema,
  VendorContactFormType,
} from 'schemas/vendor';
import { usePermission } from 'utils/permissions';

import VendorDashboard from './VendorDashboard';

interface VendorDetailProps {
  vendorId: string;
}

const VendorDetail: React.FC<VendorDetailProps> = ({ vendorId }) => {
  const router = useRouter();
  const { hasPermission } = usePermission();

  const [vendor, setVendor] = useState<VendorResponse | null>(null);
  const [contacts, setContacts] = useState<VendorContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContacts, setTotalContacts] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [deleteContactModalOpen, setDeleteContactModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] =
    useState<VendorContactResponse | null>(null);
  const [editingContact, setEditingContact] =
    useState<VendorContactResponse | null>(null);

  const tabStore = useTab({ defaultSelectedId: 'overview' });
  const selectedTab = tabStore.useState('selectedId');

  const loadVendorData = async () => {
    try {
      setLoading(true);
      const vendorData = await vendorService.getVendor(vendorId);
      setVendor(vendorData);
    } catch (error) {
      console.error('Error loading vendor:', error);
      toast.error('Failed to load vendor data');
      router.push('/vendors');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async (page: number = 1) => {
    try {
      setContactsLoading(true);
      const response = await vendorContactService.getVendorContacts(
        vendorId,
        page,
      );
      setContacts(response.contacts);
      setTotalPages(response.total_pages);
      setTotalContacts(response.total_entries);
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    } finally {
      setContactsLoading(false);
    }
  };

  useEffect(() => {
    loadVendorData();
  }, [vendorId]);

  useEffect(() => {
    if (selectedTab === 'contacts') {
      loadContacts(currentPage);
    }
  }, [selectedTab, currentPage, vendorId]);

  const handleAddContact = () => {
    setEditingContact(null);
    setContactModalOpen(true);
  };

  const handleEditContact = (contact: VendorContactResponse) => {
    setEditingContact(contact);
    setContactModalOpen(true);
  };

  const handleDeleteContactClick = (contact: VendorContactResponse) => {
    setContactToDelete(contact);
    setDeleteContactModalOpen(true);
  };

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;

    try {
      await vendorContactService.deleteVendorContact(
        vendorId,
        contactToDelete.id,
      );
      toast.success('Contact deleted successfully');
      loadContacts(currentPage);
      setDeleteContactModalOpen(false);
      setContactToDelete(null);
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  const handleContactSubmit = async (contactData: any) => {
    try {
      if (editingContact) {
        await vendorContactService.updateVendorContact(
          vendorId,
          editingContact.id,
          contactData,
        );
        toast.success('Contact updated successfully');
      } else {
        await vendorContactService.createVendorContact(vendorId, {
          ...contactData,
          vendor_id: vendorId,
        });
        toast.success('Contact added successfully');
      }
      setContactModalOpen(false);
      setEditingContact(null);
      loadContacts(currentPage);
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error(
        editingContact ? 'Failed to update contact' : 'Failed to add contact',
      );
    }
  };

  if (loading) {
    return (
      <Flex align="center" justify="center" h="100vh">
        <Spinner size={32} />
      </Flex>
    );
  }

  if (!vendor) {
    return (
      <Box>
        <Text>Vendor not found</Text>
      </Box>
    );
  }

  const contactColumns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: any) => <Text fontWeight="500">{row.original.name}</Text>,
    },
    {
      header: 'Job Title',
      accessorKey: 'job_title',
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.job_title || '—'}</Text>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.email || '—'}</Text>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.phone || '—'}</Text>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: any) => (
        <Flex gap="sm">
          {hasPermission('vendor', 'manage') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditContact(row.original)}
              title="Edit contact">
              <PencilSimpleIcon size={16} />
            </Button>
          )}
          {hasPermission('vendor', 'delete') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteContactClick(row.original)}
              title="Delete contact"
              color="red">
              <TrashIcon size={16} />
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Box>
      <PageInner>
        <Tab.List store={tabStore}>
          <Tab id="overview" store={tabStore}>
            Overview
          </Tab>
          <Tab id="contacts" store={tabStore}>
            Contacts
          </Tab>
        </Tab.List>
        <Tab.Panel tabId="overview" store={tabStore}>
          <Box mt="lg">
            <Flex gap="lg" mb="xl">
              {vendor.logo_url && (
                <Box
                  as="img"
                  src={vendor.logo_url}
                  alt={vendor.name}
                  w="120px"
                  h="120px"
                  borderRadius="lg"
                  objectFit="cover"
                  border="2px solid"
                  borderColor="border"
                />
              )}
              <Box flex={1}>
                <Text variant="2xl" fontWeight="600" mb="sm">
                  {vendor.name}
                </Text>
                {vendor.contact_person && (
                  <Flex align="center" gap="sm" mb="sm">
                    <UserIcon size={16} />
                    <Text color="text-secondary">
                      Contact: {vendor.contact_person}
                    </Text>
                  </Flex>
                )}
                <Flex gap="lg" flexWrap="wrap">
                  {vendor.email && (
                    <Flex align="center" gap="sm">
                      <EnvelopeIcon size={16} />
                      <Text color="text-secondary">{vendor.email}</Text>
                    </Flex>
                  )}
                  {vendor.phone && (
                    <Flex align="center" gap="sm">
                      <PhoneIcon size={16} />
                      <Text color="text-secondary">{vendor.phone}</Text>
                    </Flex>
                  )}
                  {vendor.website && (
                    <Flex align="center" gap="sm">
                      <GlobeIcon size={16} />
                      <Text color="text-secondary">{vendor.website}</Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
            </Flex>
            <VendorDashboard vendorId={vendorId} />
            <Text variant="xl" fontWeight="600" mb="lg">
              Basic Information
            </Text>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
              gap="lg">
              <Box
                bg="background-primary"
                p="lg"
                borderRadius="lg"
                border="1px solid"
                borderColor="border">
                <Text variant="lg" fontWeight="600" mb="md">
                  Address Information
                </Text>
                <Flex direction="column" gap="sm">
                  {vendor.address && (
                    <Flex align="start" gap="sm">
                      <MapPinIcon size={16} style={{ marginTop: '2px' }} />
                      <Text color="text-secondary">{vendor.address}</Text>
                    </Flex>
                  )}
                  {vendor.city && (
                    <Flex align="center" gap="sm">
                      <BuildingIcon size={16} />
                      <Text color="text-secondary">{vendor.city}</Text>
                    </Flex>
                  )}
                  {vendor.country && (
                    <Flex align="center" gap="sm">
                      <MapPinIcon size={16} />
                      <Text color="text-secondary">{vendor.country}</Text>
                    </Flex>
                  )}
                </Flex>
              </Box>
              <Box
                bg="background-primary"
                p="lg"
                borderRadius="lg"
                border="1px solid"
                borderColor="border">
                <Text variant="lg" fontWeight="600" mb="md">
                  Business Information
                </Text>
                <Flex direction="column" gap="sm">
                  {vendor.registration_number && (
                    <Box>
                      <Text fontWeight="500" mb="xs">
                        Registration Number
                      </Text>
                      <Text color="text-secondary">
                        {vendor.registration_number}
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Box>
              <Box
                bg="background-primary"
                p="lg"
                borderRadius="lg"
                border="1px solid"
                borderColor="border">
                <Text variant="lg" fontWeight="600" mb="md">
                  System Information
                </Text>
                <Flex direction="column" gap="sm">
                  <Flex align="center" gap="sm">
                    <CalendarIcon size={16} />
                    <Text color="text-secondary">
                      Created:{' '}
                      {new Date(vendor.inserted_at).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Flex align="center" gap="sm">
                    <CalendarIcon size={16} />
                    <Text color="text-secondary">
                      Updated:{' '}
                      {new Date(vendor.updated_at).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Box>
        </Tab.Panel>
        <Tab.Panel tabId="contacts" store={tabStore}>
          <Box mt="lg">
            <Flex justify="space-between" align="center" mb="lg">
              <Flex gap="md" align="center">
                <Text variant="lg" fontWeight="600">
                  Vendor Contacts
                </Text>
              </Flex>
              {hasPermission('vendor', 'manage') && (
                <Button variant="secondary" onClick={handleAddContact}>
                  <PlusIcon size={16} />
                  Add Contact
                </Button>
              )}
            </Flex>
            <Table
              data={contacts || []}
              columns={contactColumns || []}
              isLoading={contactsLoading}
              skeletonRows={5}
              emptyMessage="No contacts found. Add your first contact to get started."
            />
            {totalPages > 1 && (
              <Flex justify="center" mt="lg">
                <Pagination
                  initialPage={currentPage}
                  totalPage={totalPages}
                  onPageChange={setCurrentPage}
                  totalEntries={totalContacts}
                />
              </Flex>
            )}
          </Box>
        </Tab.Panel>
      </PageInner>

      <Modal
        open={deleteContactModalOpen}
        onClose={() => {
          setDeleteContactModalOpen(false);
          setContactToDelete(null);
        }}
        ariaLabel="Delete Contact Confirmation">
        <Box p="lg">
          <Text variant="xl" fontWeight="600" mb="md">
            Delete Contact
          </Text>
          <Text mb="md" display="inline-flex">
            You are about to delete contact{' '}
            <Text as="span" fontWeight="600">
              &quot;{contactToDelete?.name}&quot;
            </Text>
          </Text>
          <Text mb="lg">
            This action will:
            <Box as="ul" mt="xs">
              <Box as="li">Remove the contact&apos;s information</Box>
              <Box as="li">Remove their association with this vendor</Box>
              <Box as="li">Cannot be undone</Box>
            </Box>
          </Text>
          <Text mb="lg" fontWeight="500">
            Are you sure you want to proceed?
          </Text>
          <Flex gap="md" justify="end">
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteContactModalOpen(false);
                setContactToDelete(null);
              }}>
              No, Keep Contact
            </Button>
            <Button variant="primary" danger onClick={handleDeleteContact}>
              Yes, Delete Contact
            </Button>
          </Flex>
        </Box>
      </Modal>

      <ContactFormDrawer
        open={contactModalOpen}
        onClose={() => {
          setContactModalOpen(false);
          setEditingContact(null);
        }}
        contact={editingContact}
        onSubmit={handleContactSubmit}
      />
    </Box>
  );
};

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  contact: VendorContactResponse | null;
  onSubmit: (data: any) => Promise<void>;
}

const ContactFormDrawer: React.FC<ContactFormModalProps> = ({
  open,
  onClose,
  contact,
  onSubmit,
}) => {
  const drawer = useDrawer({ open, setOpen: (v) => !v && onClose() });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  const handleFormSubmit = async (data: VendorContactFormType) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Drawer store={drawer} placement="right" withBackdrop={true} open={open}>
      <Flex
        as="form"
        h="100vh"
        direction="column"
        onSubmit={handleSubmit(handleFormSubmit)}>
        <Box flexShrink="0">
          <Drawer.Header>
            <Drawer.Title>
              {contact ? 'Edit Contact' : 'Add Contact'}
            </Drawer.Title>
            <XIcon size={20} weight="bold" cursor="pointer" onClick={onClose} />
          </Drawer.Header>
        </Box>
        <Flex
          borderTop="1px solid"
          borderColor="border"
          direction="column"
          flex={1}
          gap="md"
          overflowY="auto"
          px="xl"
          py="md">
          <Field label="Name" required error={errors.name?.message}>
            <InputText
              {...register('name')}
              placeholder="Enter contact name"
              required
            />
          </Field>

          <Field label="Job Title" error={errors.job_title?.message}>
            <InputText
              {...register('job_title')}
              placeholder="Enter job title"
            />
          </Field>

          <Field label="Email" required error={errors.email?.message}>
            <InputText
              {...register('email')}
              type="email"
              placeholder="Enter email address"
              required
            />
          </Field>

          <Field label="Phone" error={errors.phone?.message}>
            <InputText
              {...register('phone')}
              placeholder="Enter phone number"
            />
          </Field>
        </Flex>

        <Box flexShrink="0" borderTop="1px solid" borderColor="border" p="xl">
          <Flex gap="md" justify="flex-end">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {contact ? 'Update Contact' : 'Add Contact'}
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Drawer>
  );
};

export default VendorDetail;
