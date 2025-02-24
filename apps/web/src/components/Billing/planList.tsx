import React, { useEffect, useState } from 'react';
import { promise } from 'zod';
import { Button, Box, Flex } from '@wraft/ui';
import { TickIcon } from '@wraft/icon';
import toast from 'react-hot-toast';

import { Text } from 'common/Text';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI, postAPI } from 'utils/models';

import { Subscription, Plan, PlansApiResponse } from './types';
import { usePaddle } from './usePaddle';
import TransactionList from './transaction';

type ApiResponse = {
  success: boolean;
  message?: string;
};

type InvoiceResponse = {
  invoice_url: string;
};

const PlanList = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const { userProfile } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  const { handleCheckout, paddleError } = usePaddle({
    token: 'test_752dcaf9ae716bc48b5ce5fa77b',
    environment: 'sandbox',
  });

  const fetchPlans = async () => {
    try {
      const PlansData = (await fetchAPI(
        'plans/active_plans ',
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

  const changePlan = async (plan: Plan) => {
    try {
      const response = (await postAPI(
        `billing/subscription/${plan.id}/change`,
        {},
      )) as ApiResponse;
      console.log('Change Plan Response:', response);
      if (response.success) {
        const subscriptionData = await fetchSubscription();
        setCurrentSubscription(subscriptionData);
        toast.success('Plan changed successfully.', {
          duration: 3000,
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Error changing plan.', {
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

  const processPaddleCheckout = async (plan: Plan) => {
    const priceId = plan.plan_id;
    console.log('plan id', plan.id);

    if (!priceId) {
      console.error('Price ID is missing for the selected plan');
      return;
    }

    try {
      await handleCheckout({
        discountId: plan.coupon?.coupon_id,
        items: [
          {
            priceId: priceId,
            quantity: 1,
          },
        ],
        customData: {
          plan_id: plan.id,
          user_id: userProfile.id,
          organisation_id: userProfile.currentOrganisation.id,
        },
      });
      const subscriptionData = await fetchSubscription();
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  const offerPrice = (plan: Plan) => {
    if (plan.coupon) {
      const orgPrice = parseFloat(plan.plan_amount);

      if (plan.coupon.type === 'percentage' && plan.coupon.amount) {
        const discPer = parseFloat(plan.coupon.amount);
        const discAmount = (orgPrice * discPer) / 100;
        return Math.round(orgPrice - discAmount);
      } else if (plan.coupon.type === 'flat' && plan.coupon.amount) {
        const discAmount = parseFloat(plan.coupon.amount);
        return Math.round(orgPrice - discAmount);
      }
    }
    return null;
  };

  const filterPlans = plans.filter(
    (plan) => plan.billing_interval === (isYearly ? 'year' : 'month'),
  );

  const paidPlans = filterPlans.filter((plan) => plan.plan_amount !== '0');

  return (
    <Flex direction="column" align="center" justify="center">
      {paddleError && (
        <Box p="lg" color="red">
          {paddleError}
        </Box>
      )}

      {currentSubscription && (
        <Box
          w="100%"
          maxWidth="960px"
          bg="green.100"
          p="lg"
          mb="xl"
          borderRadius="md">
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize={18} fontWeight="bold">
                Current Subscription
              </Text>
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
            <Flex gap="sm">
              <Button variant="secondary" onClick={toggleDetails}>
                {showDetails ? 'Hide Details' : 'View Details'}
              </Button>
              <Button onClick={cancelSubscription}>Cancel Subscription</Button>
            </Flex>
          </Flex>

          {showDetails && (
            <Box mt="lg" p="lg" bg="white" borderRadius="md">
              <Text>
                <strong>Next Bill Date:</strong>{' '}
                {currentSubscription.next_bill_date}
              </Text>
              <Text>
                <strong>Next Bill Amount:</strong> $
                {currentSubscription.next_bill_amount}
              </Text>
              <Box>
                <Text fontWeight="bold">Features:</Text>
                <ul>
                  {currentSubscription.plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Box>
              <Flex>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setShowTransactionHistory(!showTransactionHistory)
                  }>
                  {showTransactionHistory
                    ? 'Hide Transaction History'
                    : 'View Transaction History'}
                </Button>
              </Flex>

              {showTransactionHistory && (
                <TransactionList
                  organisationId={userProfile.currentOrganisation.id}
                  onDownloadInvoice={downloadInvoice}
                />
              )}
            </Box>
          )}
        </Box>
      )}

      <Box
        w="100%"
        maxWidth="960px"
        bg="background"
        p="xl"
        borderRadius="lg"
        style={{
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
        <Flex justify="space-between" align="center" mb="xl">
          <Text fontSize={40}>All Plans</Text>
          <Flex align="center" gap="lg">
            <Text>Monthly</Text>
            <Button
              onClick={() => setIsYearly(!isYearly)}
              variant={isYearly ? 'primary' : 'primary'}>
              <Box
                position="absolute"
                left={isYearly ? '32px' : '4px'}
                w="24px"
                h="24px"
                borderRadius="12px"
                background="white"
                transition="left 0.2s"
              />
            </Button>
            <Text>Yearly</Text>
          </Flex>
        </Flex>

        <Flex wrap="wrap" gap="xl">
          {paidPlans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan.id === plan.id;
            const discountedPrice = offerPrice(plan);

            return (
              <Box
                key={plan.id}
                p="lg"
                flex="1 1 calc(50% - 16px)"
                boxShadow="0 2px 8px rgba(0, 0, 0, 0.1)">
                {plan.coupon && (
                  <Text fontSize="12" fontWeight="bold">
                    {plan.coupon.type === 'percentage'
                      ? `Up to ${plan.coupon.amount}% OFF`
                      : `$${plan.coupon.amount} OFF`}
                  </Text>
                )}

                <Text fontSize={30}>{plan.name}</Text>
                <Flex align="baseline" gap="md">
                  {discountedPrice ? (
                    <>
                      <Text fontSize={20} fontWeight="bold">
                        ${discountedPrice}
                      </Text>
                      <Text fontSize={16} textDecoration="line-through">
                        ${Math.round(parseFloat(plan.plan_amount))}
                      </Text>
                    </>
                  ) : (
                    <Text fontSize={20} fontWeight="bold">
                      ${Math.round(parseFloat(plan.plan_amount))}
                    </Text>
                  )}
                </Flex>

                <Box>
                  {plan.features.map((feature, index) => (
                    <Flex key={index} align="center" gap="sm">
                      <TickIcon color="green" /> <Text>{feature}</Text>
                    </Flex>
                  ))}
                </Box>

                {plan.name !== 'Free trial' && (
                  <Button
                    variant={isCurrentPlan ? 'primary' : 'secondary'}
                    size="md"
                    onClick={() => {
                      if (!isCurrentPlan) {
                        processPaddleCheckout(plan);
                      }
                    }}>
                    {isCurrentPlan ? 'Subscribed' : 'Get Plan'}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => changePlan(plan)}
                  size="md">
                  Change Plan
                </Button>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </Flex>
  );
};

export default PlanList;
