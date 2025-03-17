import React, { useState, useEffect } from 'react';
import { Table, Button, Box, Text } from '@wraft/ui';
import toast from 'react-hot-toast';

import { fetchAPI } from 'utils/models';

import { Transaction, TransactionApiResponse } from './types';

type TransactionListProps = {
  organisationId: string;
  onDownloadInvoice: (transactionId: string) => Promise<void>;
};

const TransactionList = ({
  organisationId,
  onDownloadInvoice,
}: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = (await fetchAPI(
          `billing/subscription/${organisationId}/transactions`,
        )) as TransactionApiResponse;
        setTransactions(response.transactions || []);
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
  }, [organisationId]);

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
    },
    {
      header: 'Amount',
      accessorKey: 'total_amount',
      cell: (info: any) => `$${info.getValue()}`,
      width: '100px',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: (info: any) => formatDate(info.getValue()),
      width: '150px',
    },
    {
      header: 'Holder Name',
      accessorKey: 'payment_method_details.card.cardholder_name',
      width: '200px',
    },
    {
      header: 'Billing Period',
      accessorKey: '',
      cell: (info: any) =>
        formatBillingPeriod(
          info.row.original.billing_period_start,
          info.row.original.billing_period_end,
        ),
      width: '250px',
    },
    {
      header: 'Account',
      accessorKey: '',
      cell: (info: any) => {
        const paymentMethod = info.row.original.payment_method_details;
        const card = paymentMethod && paymentMethod.card;
        if (!card) return 'N/A';
        return `${card.type} •••• ${card.last4} (Exp: ${card.expiry_month}/${card.expiry_year})`;
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
    </Box>
  );
};

export default TransactionList;
