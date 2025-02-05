import React, { useEffect, useState } from 'react';
import { Flex, Box } from 'theme-ui';
import { Button } from '@wraft/ui';
import { promise } from 'zod';
import { TickIcon } from '@wraft/icon';

import { Text } from 'common/Text';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, deleteAPI, postAPI } from 'utils/models';

import { usePaddleIntegration } from './paddle';
import { fetchSubscription } from './subscription';
import { Subscription, Plan, PlansApiResponse } from './types';
import TransactionList from './transaction';

type ApiResponse = {
  success: boolean;
  message?: string;
};

type InvoiceResponse = {
  invoice_url: string;
};

const AllPlansUI = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const { userProfile } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  const toggleDetails = () => setShowDetails(!showDetails);

  const { handleCheckout, paddleError } = usePaddleIntegration({
    token: 'test_752dcaf9ae716bc48b5ce5fa77b',
    environment: 'sandbox',
  });

  const fetchPlans = async () => {
    try {
      const PlansData = (await fetchAPI('plans/active_standard_plans')) as PlansApiResponse;
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
          setActivePlanId(subscriptionData.plan.id);
        }),
      ]);
    } catch (error) {
      console.error('Error loading plans and subscription:', error);
    }
  };

  const cancelSubscription = async () => {
    try {
      const response = (await deleteAPI('billing/subscription/cancel')) as ApiResponse;
      console.log('API Response:', response);
      if (response.success) {
        setCurrentSubscription(null);
        setActivePlanId(null);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  };

  const changePlan = async (plan: Plan) => {
    try {
      const response = (await postAPI(`billing/subscription/${plan.id}/change`, {})) as ApiResponse;
      console.log('Change Plan Response:', response);
      setApiResponse(response);
      if (response.success) {
        const subscriptionData = await fetchSubscription();
        setCurrentSubscription(subscriptionData);
        setActivePlanId(subscriptionData.plan.id);
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
      setActivePlanId(subscriptionData.plan.id);
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  const filterPlans = plans.filter(
    (plan) => plan.billing_interval === (isYearly ? 'year' : 'month'),
  );

  const paidPlans = filterPlans.filter((plan) => plan.plan_amount !== '0');

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'auto',
        padding: 4,
      }}>
      {paddleError && <Box sx={{ color: 'red', mb: 3 }}>{paddleError}</Box>}

      {currentSubscription && (
        <Box
          sx={{
            width: '100%',
            maxWidth: 960,
            bg: 'green.100',
            p: 3,
            mb: 4,
            borderRadius: 'md',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}>
          <Flex
            sx={{
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Box>
              <Text fontSize={18} fontWeight="bold">
                Current Subscription
              </Text>
              <Text>
                Plan: <strong>{currentSubscription.plan.name}</strong>
              </Text>
              <Text>
                Billing interval: <strong>{currentSubscription.plan.billing_interval}</strong>
              </Text>
              <Text>
                Status: <strong>{currentSubscription.status}</strong>
              </Text>
            </Box>
            <Flex sx={{ gap: 2 }}>
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
              sx={{
                mt: 3,
                p: 3,
                bg: 'white',
                borderRadius: 'md',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }}>
              <Text>
                <strong>Next Bill Date:</strong> {currentSubscription.next_bill_date}
              </Text>
              <Text>
                <strong>Next Bill Amount:</strong> ${currentSubscription.next_bill_amount}
              </Text>
              <Box sx={{ mt: 2 }}>
                <Text fontWeight="bold">Features:</Text>
                <ul>
                  {currentSubscription.plan.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </Box>
              <Flex sx={{ gap: 2, mt: 3 }}>
                <Button
                  variant="secondary"
                  onClick={() => setShowTransactionHistory(!showTransactionHistory)}>
                  {showTransactionHistory ? 'Hide Transaction History' : 'View Transaction History'}
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
        sx={{
          width: '100%',
          maxWidth: 960,
          bg: 'background',
          p: 4,
          borderRadius: 'lg',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}>
        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Text fontSize={40}>All Plans</Text>
          <Flex sx={{ alignItems: 'center', gap: 3 }}>
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
                sx={{
                  position: 'absolute',
                  left: isYearly ? '32px' : '4px',
                  top: '4px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '12px',
                  bg: 'white',
                  transition: 'left 0.2s',
                }}
              />
            </Button>
            <Text>Yearly</Text>
          </Flex>
        </Flex>
        <Box></Box>

        <Flex sx={{ flexWrap: 'wrap', gap: 4, justifyContent: 'space-between' }}>
          {paidPlans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan.id === plan.id;

            return (
              <Box
                key={plan.id}
                sx={{
                  flex: '1 1 calc(50% - 16px)',
                  bg: 'white',
                  p: 3,
                  borderRadius: 'md',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  textAlign: 'left',
                }}>
                <Text>{plan.name}</Text>
                <Text fontSize={24} my={2}>
                  ${plan.plan_amount}
                </Text>
                <Box>
                  {plan.features.map((feature, index) => (
                    <Flex key={index} sx={{ alignItems: 'center', gap: 2 }}>
                      <TickIcon color="green" /> {/* Adjust size and color as needed */}
                      <Text>{feature}</Text>
                    </Flex>
                  ))}
                </Box>
                {plan.name !== 'Free trial' && (
                  <Button
                    variant={isCurrentPlan ? 'primary' : 'secondary'}
                    style={{
                      width: '100%',
                      marginTop: '10px',
                    }}
                    onClick={() => {
                      if (!isCurrentPlan) {
                        setActivePlanId(plan.id);
                        processPaddleCheckout(plan);
                      }
                    }}>
                    {isCurrentPlan ? 'Subscribed' : 'Get Plan'}
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => changePlan(plan)}
                  style={{
                    marginTop: '10px',
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

export default AllPlansUI;
