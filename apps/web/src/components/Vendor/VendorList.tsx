import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Flex,
  Text,
  Button,
  InputText,
  Table,
  Modal,
  Pagination,
} from '@wraft/ui';
import {
  MagnifyingGlassIcon,
  TrashIcon,
  PencilSimpleIcon,
  EyeIcon,
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

  useEffect(() => {
    loadVendors();
  }, [loadVendors, rerender]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleVendorSelect = (vendor: VendorResponse) => {
    if (onVendorSelect) {
      onVendorSelect(vendor);
    } else {
      router.push(`/vendors/${vendor.id}`);
    }
  };

  const handleVendorEdit = (vendor: VendorResponse) => {
    if (onVendorEdit) {
      onVendorEdit(vendor);
    } else {
      router.push(`/vendors/${vendor.id}/edit`);
    }
  };

  const handleVendorDelete = (vendor: VendorResponse) => {
    setVendorToDelete(vendor);
    setDeleteModalOpen(true);
  };

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
      enableSorting: false,
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.city || '—'}</Text>
      ),
    },
    {
      header: 'Country',
      accessorKey: 'country',
      enableSorting: false,
      cell: ({ row }: any) => (
        <Text color="text-secondary">{row.original.country || '—'}</Text>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row }: any) => (
        <Text color="text-secondary" fontSize="sm">
          {new Date(row.original.inserted_at).toLocaleDateString()}
        </Text>
      ),
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
      enableSorting: false,
      cell: ({ row }: any) => (
        <Flex gap="sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleVendorSelect(row.original);
            }}
            title="View details">
            <EyeIcon size={16} />
          </Button>
          {hasPermission('template', 'show') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVendorEdit(row.original);
              }}
              title="Edit vendor">
              <PencilSimpleIcon size={16} />
            </Button>
          )}
          {hasPermission('template', 'show') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVendorDelete(row.original);
              }}
              title="Delete vendor"
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
        <Box mb="lg">
          <Flex gap="md" align="end" justify="flex-end">
            <Box w="360px">
              <InputText
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                icon={<Box w="18px" as={MagnifyingGlassIcon} size={12} />}
                iconPlacement="right"
              />
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
            onRowClick={(row) => handleVendorSelect(row.original)}
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
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        ariaLabel="Delete Vendor Confirmation">
        <Box p="lg" w="500px">
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
            <Button variant="primary" danger onClick={confirmDelete}>
              Delete Vendor
            </Button>
          </Flex>
        </Box>
      </Modal>
    </Box>
  );
};

export default VendorList;
