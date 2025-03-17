import React, { useEffect, useState } from 'react';
import { promise } from 'zod';
import { Button, Box, Flex, Text } from '@wraft/ui';
import toast from 'react-hot-toast';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI } from 'utils/models';

import { Subscription, Plan, PlansApiResponse } from './types';
import TransactionList from './transaction';
import PlanPrice from './upgradePlan/planPrice';

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
                Current Subscription
              </Text>
              <Button onClick={cancelSubscription}>Cancel Subscription</Button>
            </Flex>
            <Box mt="md">
              <Text>
                Plan: <strong>{currentSubscription.plan.name}</strong>
              </Text>
              <Text>
                Billing interval:{' '}
                <strong>{currentSubscription.plan.billing_interval}</strong>
              </Text>
              <Text>
                Status: <strong>{currentSubscription.status}</strong>
              </Text>
            </Box>
            <Flex justify="flex-end" mt="md"></Flex>
          </Box>

          <PlanPrice />
          <Box bg="background-primary" py="md" px="xxl" borderRadius="md">
            <Text fontWeight="bold">Next Bill Details</Text>
            <Box mt="md">
              <Text>
                <strong>Next Bill Date:</strong>{' '}
                {currentSubscription.next_bill_date}
              </Text>
              <Text fontWeight="bold">
                Next Bill Amount: ${currentSubscription.next_bill_amount}
              </Text>
              <Text fontWeight="bold">Features:</Text>
              <Text>
                <Box as="ul">
                  {currentSubscription.plan.features.map((feature, index) => (
                    <Box as="li" key={index}>
                      {feature}
                    </Box>
                  ))}
                </Box>
              </Text>
            </Box>
          </Box>

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
