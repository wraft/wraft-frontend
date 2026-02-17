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
  BuildingIcon,
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

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;
  return (
    <Box>
      <Text fontSize="sm" color="text-secondary" mb="xs">
        {label}
      </Text>
      <Text fontSize="sm2">{value}</Text>
    </Box>
  );
};

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
      <Flex align="center" justify="center" py="3xl">
        <Spinner size={24} />
      </Flex>
    );
  }

  if (!vendor) {
    return (
      <Box p="xl">
        <Text color="text-secondary">Vendor not found</Text>
      </Box>
    );
  }

  const hasContact =
    vendor.email || vendor.phone || vendor.website || vendor.contact_person;
  const hasAddress = vendor.address || vendor.city || vendor.country;

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
      header: '',
      accessorKey: 'actions',
      cell: ({ row }: any) => (
        <Flex gap="xs" justify="flex-end">
          {hasPermission('vendor', 'manage') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEditContact(row.original)}
              title="Edit contact"
            >
              <PencilSimpleIcon size={14} />
            </Button>
          )}
          {hasPermission('vendor', 'delete') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteContactClick(row.original)}
              title="Delete contact"
            >
              <TrashIcon size={14} />
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Box>
      <PageInner>
        {/* Vendor Profile */}
        <Flex gap="md" align="center" mb="md">
          {vendor.logo_url ? (
            <Box
              as="img"
              src={vendor.logo_url}
              alt={vendor.name}
              w="48px"
              h="48px"
              borderRadius="md"
              objectFit="cover"
              border="1px solid"
              borderColor="border"
              flexShrink={0}
            />
          ) : (
            <Flex
              w="48px"
              h="48px"
              borderRadius="md"
              bg="green.300"
              align="center"
              justify="center"
              color="green.900"
              flexShrink={0}
            >
              <BuildingIcon size={20} />
            </Flex>
          )}
          <Box>
            <Text variant="lg" fontWeight="600">
              {vendor.name}
            </Text>
            {vendor.contact_person && (
              <Text fontSize="sm" color="text-secondary">
                {vendor.contact_person}
              </Text>
            )}
          </Box>
        </Flex>

        <Tab.List store={tabStore}>
          <Tab id="overview" store={tabStore}>
            Overview
          </Tab>
          <Tab id="contacts" store={tabStore}>
            Contacts
          </Tab>
        </Tab.List>

        {/* Overview Tab */}
        <Tab.Panel tabId="overview" store={tabStore}>
          <Box display="grid" gridTemplateColumns="1fr 320px" gap="xl" mt="lg">
            {/* Details */}
            <Box minW={0}>
              <Box
                border="1px solid"
                borderColor="border"
                borderRadius="md"
                bg="background-primary"
                overflow="hidden"
              >
                {/* Contact Section */}
                {hasContact && (
                  <Box>
                    <Box px="lg" py="sm">
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="text-secondary"
                      >
                        Contact
                      </Text>
                    </Box>
                    <Box px="lg" pb="lg">
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(2, 1fr)"
                        gap="md"
                      >
                        <DetailItem label="Email" value={vendor.email} />
                        <DetailItem label="Phone" value={vendor.phone} />
                        <DetailItem label="Website" value={vendor.website} />
                        <DetailItem
                          label="Contact Person"
                          value={vendor.contact_person}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Address Section */}
                {hasAddress && (
                  <Box borderTop="1px solid" borderColor="border">
                    <Box px="lg" py="sm">
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="text-secondary"
                      >
                        Address
                      </Text>
                    </Box>
                    <Box px="lg" pb="lg">
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(2, 1fr)"
                        gap="md"
                      >
                        <DetailItem label="Street" value={vendor.address} />
                        <DetailItem label="City" value={vendor.city} />
                        <DetailItem label="Country" value={vendor.country} />
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Business Section */}
                {vendor.registration_number && (
                  <Box borderTop="1px solid" borderColor="border">
                    <Box px="lg" py="sm">
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color="text-secondary"
                      >
                        Business
                      </Text>
                    </Box>
                    <Box px="lg" pb="lg">
                      <DetailItem
                        label="Registration Number"
                        value={vendor.registration_number}
                      />
                    </Box>
                  </Box>
                )}

                {/* Record Section */}
                <Box borderTop="1px solid" borderColor="border">
                  <Box px="lg" py="sm">
                    <Text fontSize="sm" fontWeight="600" color="text-secondary">
                      Record
                    </Text>
                  </Box>
                  <Box px="lg" pb="lg">
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(2, 1fr)"
                      gap="md"
                    >
                      <DetailItem
                        label="Created"
                        value={new Date(
                          vendor.inserted_at,
                        ).toLocaleDateString()}
                      />
                      <DetailItem
                        label="Updated"
                        value={new Date(vendor.updated_at).toLocaleDateString()}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Stats Sidebar */}
            <Box>
              <VendorDashboard vendorId={vendorId} />
            </Box>
          </Box>
        </Tab.Panel>

        {/* Contacts Tab */}
        <Tab.Panel tabId="contacts" store={tabStore}>
          <Box mt="lg">
            <Flex justify="space-between" align="center" mb="md">
              <Text fontSize="sm2" fontWeight="600" color="text-secondary">
                {totalContacts > 0
                  ? `${totalContacts} ${totalContacts === 1 ? 'contact' : 'contacts'}`
                  : 'Contacts'}
              </Text>
              {hasPermission('vendor', 'manage') && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddContact}
                >
                  <PlusIcon size={14} />
                  Add Contact
                </Button>
              )}
            </Flex>
            <Box
              border="1px solid"
              borderColor="border"
              borderRadius="md"
              overflow="hidden"
            >
              <Table
                data={contacts || []}
                columns={contactColumns || []}
                isLoading={contactsLoading}
                skeletonRows={5}
                emptyMessage="No contacts yet"
              />
            </Box>
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

      {/* Delete Contact Modal */}
      <Modal
        open={deleteContactModalOpen}
        onClose={() => {
          setDeleteContactModalOpen(false);
          setContactToDelete(null);
        }}
        ariaLabel="Delete Contact"
      >
        <Box p="xl">
          <Text fontSize="base" fontWeight="600" mb="md">
            Delete Contact
          </Text>
          <Text fontSize="sm2" color="text-secondary" mb="lg">
            Are you sure you want to delete{' '}
            <Text as="span" fontWeight="600" color="text-primary">
              {contactToDelete?.name}
            </Text>
            ? This action cannot be undone.
          </Text>
          <Flex gap="sm" justify="flex-end">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setDeleteContactModalOpen(false);
                setContactToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              danger
              onClick={handleDeleteContact}
            >
              Delete
            </Button>
          </Flex>
        </Box>
      </Modal>

      {/* Contact Form Drawer */}
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
        onSubmit={handleSubmit(handleFormSubmit)}
      >
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
          py="md"
        >
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
