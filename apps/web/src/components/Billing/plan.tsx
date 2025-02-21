import React, { useEffect, useState } from 'react';
import { promise } from 'zod';
import { Button, Box, Flex } from '@wraft/ui';
import { TickIcon } from '@wraft/icon';

import { Text } from 'common/Text';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI, postAPI } from 'utils/models';

import { Subscription, Plan, PlansApiResponse } from './types';
import { usePaddleIntegration } from './paddle';
import TransactionList from './transaction';

type ApiResponse = {
  success: boolean;
  message?: string;
};

type InvoiceResponse = {
  invoice_url: string;
};

const PlanTemplateList = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isYearly, setIsYearly] = useState(false);
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const { userProfile } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  const { handleCheckout, paddleError } = usePaddleIntegration({
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
      console.log('Error fetching plans:', error);
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
      console.error('Error loading plans and subscription:', error);
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
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
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
      }
    } catch (error) {
      console.error('Error changing plan:', error);
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
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{
        minHeight: 'auto',
        padding: 'xl',
      }}>
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
          borderRadius="md"
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}>
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
              <Button
                variant="secondary"
                onClick={toggleDetails}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}>
                {showDetails ? 'Hide Details' : 'View Details'}
              </Button>
              <Button
                onClick={cancelSubscription}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}>
                Cancel Subscription
              </Button>
            </Flex>
          </Flex>

          {showDetails && (
            <Box
              mt="lg"
              p="lg"
              bg="white"
              borderRadius="md"
              style={{
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }}>
              <Text>
                <strong>Next Bill Date:</strong>{' '}
                {currentSubscription.next_bill_date}
              </Text>
              <Text>
                <strong>Next Bill Amount:</strong> $
                {currentSubscription.next_bill_amount}
              </Text>
              <Box style={{ marginTop: '8px' }}>
                <Text fontWeight="bold">Features:</Text>
                <ul>
                  {currentSubscription.plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Box>
              <Flex style={{ gap: '8px', marginTop: '16px' }}>
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
              variant="secondary"
              onClick={() => setIsYearly(!isYearly)}
              style={{
                position: 'relative',
                width: '60px',
                height: '32px',
                borderRadius: '16px',
                background: isYearly ? 'primary' : 'gray',
                cursor: 'pointer',
                padding: 0,
                border: 'none',
              }}>
              <Box
                style={{
                  position: 'absolute',
                  left: isYearly ? '32px' : '4px',
                  top: '4px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  background: 'white',
                  transition: 'left 0.2s',
                }}
              />
            </Button>
            <Text>Yearly</Text>
          </Flex>
        </Flex>

        <Flex wrap="wrap" gap="xl" justify="space-between">
          {paidPlans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan.id === plan.id;
            const discountedPrice = offerPrice(plan);

            return (
              <Box
                key={plan.id}
                p="lg"
                style={{
                  flex: '1 1 calc(50% - 16px)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  textAlign: 'left',
                  position: 'relative',
                }}>
                {plan.coupon && (
                  <Text
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      borderRadius: '0 0 0 8px',
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: 'green',
                    }}>
                    {plan.coupon.type === 'percentage'
                      ? `Up to ${plan.coupon.amount}% OFF`
                      : `$${plan.coupon.amount} OFF`}
                  </Text>
                )}

                <Text fontSize={30}>{plan.name}</Text>
                <Flex align="baseline" gap="md" mt="sm">
                  {discountedPrice ? (
                    <>
                      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        ${discountedPrice}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          textDecoration: 'line-through',
                          color: 'gray',
                        }}>
                        ${Math.round(parseFloat(plan.plan_amount))}
                      </Text>
                    </>
                  ) : (
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
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
                    style={{
                      width: '100%',
                    }}
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
                  size="md"
                  style={{
                    marginTop: '6px',
                  }}>
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

export default PlanTemplateList;
