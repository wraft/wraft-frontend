import React, { useState, useEffect } from 'react';
import { Table, Button, Box, Text, Pagination } from '@wraft/ui';
import toast from 'react-hot-toast';

import { fetchAPI } from 'utils/models';

import { Transaction } from './types';

type TransactionListProps = {
  organisationId: string;
  onDownloadInvoice: (transactionId: string) => Promise<void>;
};

interface Meta {
  total_pages: number;
  total_entries: number;
  page_number: number;
}

const TransactionList = ({
  organisationId,
  onDownloadInvoice,
}: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pageMeta, setPageMeta] = useState<Meta>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const query = `sort=inserted_at_desc&page=${currentPage}`;
        const response: any = await fetchAPI(
          `billing/subscription/${organisationId}/transactions?${query}`,
        );

        setTransactions(response.transactions || []);
        setPageMeta(response);
      } catch (err) {
        toast.error('Failed to load transactions', {
          duration: 3000,
          position: 'top-right',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [organisationId, currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatBillingPeriod = (start: string, end: string) => {
    const startDate = formatDate(start);
    const endDate = formatDate(end);
    return `${startDate} - ${endDate}`;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const columns = [
    {
      header: 'Invoice Number',
      accessorKey: 'invoice_number',
      width: '150px',
      cell: ({ row }: any) => <Text>{row.original.invoice_number}</Text>,
    },
    {
      header: 'Plan',
      accessorKey: 'plan.name',
      width: '200px',
      cell: ({ row }: any) => <Text>{row.original.plan.name}</Text>,
    },
    {
      header: 'Amount',
      accessorKey: 'total_amount',
      cell: (info: any) => <Text>${info.getValue()}</Text>,
      width: '100px',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (info: any) => <Text>{formatDate(info.getValue())}</Text>,
      width: '150px',
    },
    {
      header: 'Holder Name',
      accessorKey: 'payment_method_details.card.cardholder_name',
      width: '200px',
      cell: ({ row }: any) => (
        <Text>
          {row?.original?.payment_method_details?.card?.cardholder_name}
        </Text>
      ),
    },
    {
      header: 'Billing Period',
      cell: (info: any) => (
        <Text>
          {formatBillingPeriod(
            info?.row.original?.billing_period_start,
            info?.row.original?.billing_period_end,
          )}
        </Text>
      ),
      width: '250px',
    },
    {
      header: 'Account',
      accessorKey: '',
      cell: (info: any) => {
        const paymentMethod = info?.row.original?.payment_method_details;
        const card = paymentMethod && paymentMethod.card;

        return (
          <Text>
            {card
              ? `${card.type} •••• ${card.last4} (Exp: ${card.expiry_month}/${card.expiry_year})`
              : 'N/A'}
          </Text>
        );
      },
      width: '200px',
    },
    {
      header: 'Invoice',
      accessorKey: '',
      cell: (info: any) => (
        <Button
          onClick={() => onDownloadInvoice(info.row.original.transaction_id)}>
          Download
        </Button>
      ),
      width: '150px',
    },
  ];

  return (
    <Box w="100%" mt="md" overflowX="auto">
      <Text fontSize="xl" fontWeight="bold" mb="lg">
        Billing History
      </Text>
      <Table
        data={transactions}
        columns={columns}
        aria-label="Transaction History"
        isLoading={isLoading}
        emptyMessage="No transactions available"
      />
      <Box mt="md">
        {pageMeta && pageMeta?.total_pages > 1 && (
          <Pagination
            totalPage={pageMeta.total_pages}
            initialPage={currentPage}
            onPageChange={handlePageChange}
            totalEntries={pageMeta.total_entries}
          />
        )}
      </Box>
    </Box>
  );
};

export default TransactionList;
