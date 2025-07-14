import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Button,
  InputText,
  Select,
  Table,
  Modal,
  Field,
  Pagination,
} from '@wraft/ui';
import {
  MagnifyingGlass,
  Trash,
  PencilSimple,
  Eye,
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

import { vendorService } from 'components/Vendor/vendorService';
import { PageInner } from 'components/common/Atoms';
import { VendorResponse, VendorSearch } from 'schemas/vendor';
import { usePermission } from 'utils/permissions';

interface VendorListProps {
  onVendorSelect?: (vendor: VendorResponse) => void;
  rerender?: boolean;
  onVendorEdit?: (vendor: VendorResponse) => void;
}

const VendorList: React.FC<VendorListProps> = ({
  onVendorSelect,
  rerender,
  onVendorEdit,
}) => {
  const router = useRouter();
  const { hasPermission } = usePermission();

  // State management
  const [vendors, setVendors] = useState<VendorResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<VendorSearch>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<VendorResponse | null>(
    null,
  );

  // Load vendors
  const loadVendors = useCallback(async () => {
    try {
      setLoading(true);
      const response = await vendorService.getVendors(currentPage, {
        ...filters,
        query: searchQuery || undefined,
      });
      setVendors(response.vendors);
      setTotalPages(response.total_pages);
      setTotalEntries(response.total_entries);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, searchQuery]);

  // Load vendors on mount and when dependencies change
  useEffect(() => {
    loadVendors();
  }, [loadVendors, rerender]);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof VendorSearch, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle vendor selection
  const handleVendorSelect = (vendor: VendorResponse) => {
    if (onVendorSelect) {
      onVendorSelect(vendor);
    } else {
      router.push(`/vendors/${vendor.id}`);
    }
  };

  // Handle vendor edit
  const handleVendorEdit = (vendor: VendorResponse) => {
    if (onVendorEdit) {
      onVendorEdit(vendor);
    } else {
      router.push(`/vendors/${vendor.id}/edit`);
    }
  };

  // Handle vendor delete
  const handleVendorDelete = (vendor: VendorResponse) => {
    setVendorToDelete(vendor);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!vendorToDelete) return;
    try {
      await vendorService.deleteVendor(vendorToDelete.id);
      toast.success('Vendor deleted successfully');
      loadVendors();
      setDeleteModalOpen(false);
      setVendorToDelete(null);
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast.error('Failed to delete vendor');
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: ({ row }: any) => (
        <Flex align="center" gap="sm">
          {row.original.logo_url && (
            <Box
              as="img"
              src={row.original.logo_url}
              alt={row.original.name}
              w="32px"
              h="32px"
              borderRadius="md"
              objectFit="cover"
            />
          )}
          <Text fontWeight="500">{row.original.name}</Text>
        </Flex>
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
      header: 'City',
      accessorKey: 'city',
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.city || '—'}</Text>
      ),
    },
    {
      header: 'Country',
      accessorKey: 'country',
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.country || '—'}</Text>
      ),
    },
    {
      header: 'Contacts',
      accessorKey: 'contacts_count',
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.contacts_count || 0}</Text>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row }: any) => (
        <Text color="text-secondary" fontSize="sm">
          {new Date(row.original.created_at).toLocaleDateString()}
        </Text>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      cell: ({ row }: any) => (
        <Flex gap="sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVendorSelect(row.original)}
            title="View details">
            <Eye size={16} />
          </Button>
          {hasPermission('template', 'show') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVendorEdit(row.original)}
              title="Edit vendor">
              <PencilSimple size={16} />
            </Button>
          )}
          {hasPermission('template', 'show') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVendorDelete(row.original)}
              title="Delete vendor"
              color="red">
              <Trash size={16} />
            </Button>
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Box>
      <PageInner>
        {/* Search and Filters */}
        <Box mb="lg">
          <Flex gap="md" align="end">
            <Box flex={1}>
              <Field label="Search vendors">
                <InputText
                  placeholder="Search by name, email, or contact person..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon={<MagnifyingGlass size={16} />}
                />
              </Field>
            </Box>
            <Box>
              <Field label="Country">
                <Select
                  placeholder="All countries"
                  value={filters.country || ''}
                  onChange={(value) =>
                    handleFilterChange('country', value || undefined)
                  }
                  options={[]} // TODO: Get countries from API
                  isClearable
                />
              </Field>
            </Box>
          </Flex>
        </Box>

        <Box mb="lg">
          <Table
            data={vendors}
            columns={columns}
            isLoading={loading}
            skeletonRows={10}
            emptyMessage="No vendors found. Create your first vendor to get started."
          />
        </Box>

        {totalPages > 1 && (
          <Flex justify="center">
            <Pagination
              initialPage={currentPage}
              totalPage={totalPages}
              onPageChange={handlePageChange}
              totalEntries={totalEntries}
              numberPageDisplayed={5}
              numberMarginPagesDisplayed={2}
            />
          </Flex>
        )}
      </PageInner>
      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        ariaLabel="Delete Vendor Confirmation">
        <Box p="lg">
          <Text variant="lg" fontWeight="600" mb="md">
            Delete Vendor
          </Text>
          <Text mb="lg">
            Are you sure you want to delete &quot;{vendorToDelete?.name}&quot;?
            action cannot be undone and will also delete all associated
            contacts.
          </Text>
          <Flex gap="md" justify="end">
            <Button
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="delete" onClick={confirmDelete}>
              Delete Vendor
            </Button>
          </Flex>
        </Box>
      </Modal>
    </Box>
  );
};

export default VendorList;
