import React, { useEffect, useState } from 'react';
import { Button, Box, Flex, Text, Label, Grid } from '@wraft/ui';
import toast from 'react-hot-toast';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI } from 'utils/models';

import TransactionList from './transaction';
import PlanList from './planList';
import { Subscription } from './types';

type InvoiceResponse = {
  invoice_url: string;
};

const Billing = () => {
  const { userProfile, plan, subscription, setSubscription } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response: any = await deleteAPI('billing/subscription/cancel');
      if (response) {
        setTimeout(() => {
          fetchSubscription();
        }, 3000);

        toast.success('Subscription canceled successfully.', {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Error canceling subscription.', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (transactionId: string) => {
    try {
      const invoicePath = `billing/subscription/${transactionId}/invoice`;
      const invoiceData = (await fetchAPI(invoicePath)) as InvoiceResponse;

      if (invoiceData.invoice_url) {
        window.location.href = invoiceData.invoice_url;
      } else {
        console.error('No invoice URL found in the invoice data');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  const fetchSubscription = async () => {
    try {
      const subscriptionData = (await fetchAPI(
        'billing/subscription',
      )) as Subscription;
      setSubscription(subscriptionData);
    } catch (error) {
      toast.error('Error fetching subscription.', {
        duration: 3000,
        position: 'top-right',
      });

      console.error('Error fetching subscription:', error);

      throw error;
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const isPaidPlan = plan && parseFloat(plan.plan_amount || '0') > 0;

  return (
    <Flex direction="column" justify="center" p="lg">
      {plan && (
        <>
          <Box
            w="100%"
            bg="background-primary"
            p="xl"
            border="1px solid"
            borderColor="border"
            borderRadius="md">
            <Text fontSize="xl" fontWeight="bold" mb="lg">
              Active Subscription
            </Text>

            <Grid gap="md" templateColumns="repeat(2, 1fr)" mb="lg">
              <Box>
                <Label>Current Plan</Label>
                <Text fontWeight="bold">{plan.name}</Text>
              </Box>

              {isPaidPlan && (
                <Box>
                  <Label>Billing Period</Label>
                  <Text fontWeight="bold">{plan?.billing_interval}</Text>
                </Box>
              )}

              <Box>
                <Label>Status</Label>
                <Text fontWeight="bold" textTransform="capitalize">
                  {subscription?.status}
                </Text>
              </Box>

              {isPaidPlan && (
                <Box>
                  <Label>Next Renewal</Label>
                  <Text fontWeight="bold">{subscription?.next_bill_date}</Text>
                </Box>
              )}

              <Box>
                <Label>Next Renewal Amount</Label>
                <Text fontWeight="bold">${subscription?.next_bill_amount}</Text>
              </Box>
            </Grid>
            {isPaidPlan && (
              <Button onClick={cancelSubscription} loading={isLoading}>
                Cancel Subscription
              </Button>
            )}
          </Box>

          <PlanList />

          <TransactionList
            organisationId={userProfile?.organisation_id}
            onDownloadInvoice={downloadInvoice}
          />
        </>
      )}
    </Flex>
  );
};

export default Billing;
