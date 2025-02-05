import React, { useState, useEffect } from 'react';
import { Box } from 'theme-ui';
import { Table, Button } from '@wraft/ui';

import { fetchAPI } from 'utils/models';

type Transaction = {
  id: string;
  invoice_number: string;
  billing_period_start: string;
  billing_period_end: string;
  currency: string;
  date: string;
  payment_method_details: {
    card: {
      cardholder_name: string;
      expiry_month: number;
      expiry_year: number;
      last4: string;
      type: string;
    };
    type: string;
  };
  plan: {
    billing_interval: string;
    currency: string;
    description: string;
    features: string[];
    id: string;
    inserted_at: string;
    limits: {
      instance_create: number;
      content_type_create: number;
      organisation_create: number;
      organisation_invite: number;
    };
    name: string;
    plan_amount: string;
    plan_id: string;
    product_id: string;
    updated_at: string;
  };
  plan_id: string;
  provider_plan_id: string;
  provider_subscription_id: string;
  subscriber: {
    email: string;
    email_verify: boolean;
    id: string;
    inserted_at: string;
    name: string;
    updated_at: string;
  };
  subscriber_id: string;
  subtotal_amount: string;
  tax: string;
  total_amount: string;
  transaction_id: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
};

type TransactionApiResponse = ApiResponse & {
  transactions: Transaction[];
};

type TransactionListProps = {
  organisationId: string;
  onDownloadInvoice: (transactionId: string) => Promise<void>;
};

const TransactionList = ({ organisationId, onDownloadInvoice }: TransactionListProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = (await fetchAPI(
          `billing/subscription/${organisationId}/transactions`,
        )) as TransactionApiResponse;
        setTransactions(response.transactions || []);
      } catch (err) {
        setError('Failed to load transactions');
        console.error('Error fetching transactions:', err);
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
        <Button onClick={() => onDownloadInvoice(info.row.original.transaction_id)}>
          Download
        </Button>
      ),
      width: '150px',
    },
  ];

  return (
    <Box sx={{ width: '100%', mt: 4, overflowX: 'auto' }}>
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
