import React, { useEffect, useState } from 'react';
import { promise } from 'zod';
import { Button, Box, Flex, Text } from '@wraft/ui';
import toast from 'react-hot-toast';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI } from 'utils/models';

import { Subscription, Plan, PlansApiResponse } from './types';
import TransactionList from './transaction';
import PlanList from './planList';

type ApiResponse = {
  success: boolean;
  message?: string;
};

type InvoiceResponse = {
  invoice_url: string;
};

const Billing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);

  const { userProfile } = useAuth();

  const fetchPlans = async () => {
    try {
      const PlansData = (await fetchAPI(
        'plans/active_plans',
      )) as PlansApiResponse;
      setPlans(PlansData.plans || []);
    } catch (error) {
      toast.error('Error fetching plans.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const loadPlansAndSubscription = async () => {
    try {
      await promise.call([
        fetchPlans(),
        fetchSubscription().then((subscriptionData) => {
          setCurrentSubscription(subscriptionData);
        }),
      ]);
    } catch (error) {
      toast.error('Error loading data.', {
        duration: 3000,
        position: 'top-right',
      });
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = (await deleteAPI(
        'billing/subscription/cancel',
      )) as ApiResponse;
      console.log('API Response:', response);
      if (response.success) {
        setCurrentSubscription(null);
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

  const fetchSubscription = async (): Promise<Subscription> => {
    try {
      const subscriptionData = (await fetchAPI(
        'billing/subscription/',
      )) as Subscription;
      return subscriptionData;
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
    loadPlansAndSubscription();
  }, []);

  const isPaidPlan =
    currentSubscription &&
    parseFloat(currentSubscription.plan.plan_amount || '0') > 0;

  return (
    <Flex direction="column" justify="center" p="lg">
      {currentSubscription && (
        <>
          <Box
            w="100%"
            bg="background-primary"
            p="xl"
            border="1px solid"
            borderColor="border"
            borderRadius="md">
            <Flex justifyContent="space-between">
              <Text fontSize="xl" fontWeight="bold">
                Active Subscription
              </Text>
              {isPaidPlan && (
                <Button onClick={cancelSubscription}>
                  Cancel Subscription
                </Button>
              )}
            </Flex>
            <Box mt="md" spaceY="sm">
              <Flex>
                <Text fontWeight="bold">Current Plan:</Text>
                <Text mx="xs">{currentSubscription.plan.name}</Text>
              </Flex>

              {isPaidPlan && (
                <Flex>
                  <Text fontWeight="bold"> Billing Period:</Text>
                  <Text mx="xs">
                    {currentSubscription.plan.billing_interval}
                  </Text>
                </Flex>
              )}

              <Flex>
                <Text fontWeight="bold">Status:</Text>
                <Text mx="xs">{currentSubscription.status}</Text>
              </Flex>

              {isPaidPlan && (
                <Flex>
                  <Text fontWeight="bold">Next Renewal:</Text>
                  <Text mx="xs">{currentSubscription.next_bill_date}</Text>
                </Flex>
              )}

              <Flex>
                <Text fontWeight="bold">Next Renewal Amount:</Text>
                <Text mx="xs">${currentSubscription.next_bill_amount}</Text>
              </Flex>
            </Box>
          </Box>

          <PlanList />

          <TransactionList
            organisationId={userProfile.currentOrganisation.id}
            onDownloadInvoice={downloadInvoice}
          />
        </>
      )}
    </Flex>
  );
};

export default Billing;
