import React, { useState, useEffect } from 'react';
import { Button, Box, Flex, Text } from '@wraft/ui';
import { TickIcon } from '@wraft/icon';
import toast from 'react-hot-toast';
import styled from '@emotion/styled';
import { Lightning, Stack, StackSimple } from '@phosphor-icons/react';

import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, postAPI } from 'utils/models';

import type { Plan, PlansApiResponse, Subscription } from './types';
import { usePaddle } from './usePaddle';

type ApiResponse = {
  success: boolean;
  message?: string;
};

export const PlanCard = styled(Box)<{ isHighlighted?: boolean }>`
  padding: 1.5rem;
  flex: 1 1 30%;
  border-radius: 8px;
  border-color: border;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-width: 260px;
  min-height: 480px;
  background-color: var(--theme-ui-colors-background-primary);
  position: relative;

  @media (max-width: 768px) {
    min-width: 220px;
  }

  @media (max-width: 640px) {
    min-width: 100%;
    margin-bottom: 1rem;
  }
`;

const HoverableButton = styled(Button)`
  &:hover {
    ${(props) =>
      props.variant === 'secondary' && !props.disabled
        ? `
      background-color: var(--primary-color, #127D5D);
      color: white;
    `
        : ''}
  }
`;

export const CheckItem = styled(Flex)`
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  @media (max-width: 480px) {
    font-size: 0.875rem;
  }
`;

export const CardContent = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PlanList: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly',
  );
  const [currentSubscription, setCurrentSubscription] =
    useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);

  const { userProfile } = useAuth();

  const { handleCheckout, paddleError, isPaddleReady } = usePaddle({
    token: process.env.NEXT_PUBLIC_PADDLE_TOKEN || '',
    environment:
      process.env.NEXT_PUBLIC_PADDLE_ENV === 'sandbox' ||
      process.env.NEXT_PUBLIC_PADDLE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_PADDLE_ENV
        : 'sandbox',
  });
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const plansData = (await fetchAPI(
        'plans/active_plans',
      )) as PlansApiResponse;
      setPlans(plansData.plans || []);
    } catch (error) {
      toast.error('Error fetching plans.', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscription = async () => {
    try {
      const subscriptionData = (await fetchAPI(
        'billing/subscription/',
      )) as Subscription;
      setCurrentSubscription(subscriptionData);
    } catch (error) {
      console.error('Error fetching subscription:', error);
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
        await fetchSubscription();
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

  useEffect(() => {
    fetchPlans();
    fetchSubscription();
  }, []);

  const filteredPlans = plans.filter(
    (plan) =>
      plan.billing_interval === (billingCycle === 'yearly' ? 'year' : 'month'),
  );

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();

    if (name.includes('starter'))
      return <Lightning size={32} color="var(--theme-ui-colors-gray-900)" />;
    if (name.includes('pro'))
      return <Stack size={32} color="var(--theme-ui-colors-gray-900)" />;
    if (name.includes('business'))
      return <StackSimple size={32} color="var(--theme-ui-colors-gray-900)" />;
    return null;
  };

  const processPaddleCheckout = async (plan: Plan) => {
    if (!isPaddleReady) {
      toast.error(
        'Payment system is not ready yet. Please try again in a moment.',
      );
      return;
    }

    const priceId = plan.plan_id;
    if (!priceId) {
      toast.error('Price ID is missing for the selected plan');
      return;
    }

    try {
      const isFreePlan =
        currentSubscription?.plan.plan_amount === '0' ||
        parseFloat(currentSubscription?.plan.plan_amount || '1') === 0;

      if (currentSubscription && !isFreePlan) {
        await changePlan(plan);
      } else {
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
            organisation_id: userProfile?.currentOrganisation?.id,
          },
        });

        await fetchSubscription();
        toast.success('Checkout successful!');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    }
  };

  const isPlanActive = (planId: string) => {
    return currentSubscription?.plan.id === planId;
  };

  const calculateDiscountedPrice = (plan: Plan) => {
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

  if (paddleError) {
    toast.error(paddleError);
  }

  return (
    <Box textAlign="left" py="4xl">
      <Flex justify="space-between" align="center" mb="3xl">
        <Box>
          <Text fontSize="2xl" fontWeight="heading" mb="sm">
            Need More Control Over Your Documents?
          </Text>
          <Text fontSize="" color="text-secondary">
            The Silver plan gives you the basics, but upgrading unlocks more
            possibilities.
          </Text>
        </Box>

        <Flex
          justify="center"
          spaceX="xs"
          w="400px"
          border="1px solid"
          borderColor="border"
          borderRadius="md">
          <Button
            fullWidth
            variant={billingCycle === 'monthly' ? 'secondary' : 'ghost'}
            onClick={() => setBillingCycle('monthly')}>
            Monthly
          </Button>
          <Button
            fullWidth
            variant={billingCycle === 'yearly' ? 'secondary' : 'ghost'}
            onClick={() => setBillingCycle('yearly')}>
            Yearly (save 20%)
          </Button>
        </Flex>
      </Flex>

      <Flex wrap="wrap" gap="md">
        {filteredPlans
          .sort((a, b) => parseFloat(a.plan_amount) - parseFloat(b.plan_amount))
          .map((plan) => {
            const isActive = isPlanActive(plan.id);
            const discountedPrice = calculateDiscountedPrice(plan);

            return (
              <PlanCard key={plan.id} isHighlighted={isActive}>
                <CardContent>
                  <Box mb="md">{getPlanIcon(plan.name)}</Box>

                  <Text as="h3" fontSize="2xl" mb="sm">
                    {plan.name}
                  </Text>
                  <Text mb="xl" w="90%" h="40px">
                    {plan.description}
                  </Text>

                  <Flex align="baseline" gap="xs" mb="xl">
                    {discountedPrice ? (
                      <>
                        <Text fontSize="3xl" fontWeight="bold">
                          {discountedPrice}
                        </Text>
                        <Text
                          fontSize="md"
                          color="gray.900"
                          textDecoration="line-through">
                          {Math.round(parseFloat(plan?.plan_amount))}
                        </Text>
                      </>
                    ) : (
                      <Text fontSize="3xl" fontWeight="bold">
                        {plan.plan_amount}
                      </Text>
                    )}
                    <Text fontSize="lg" fontWeight="heading">
                      / {billingCycle === 'monthly' ? 'month' : 'year'}
                    </Text>
                  </Flex>

                  {plan.coupon && (
                    <Text fontSize="sm" fontWeight="bold" mb="sm">
                      {plan.coupon.type === 'percentage'
                        ? `${plan.coupon.amount}% OFF`
                        : `$${plan.coupon.amount} OFF`}
                    </Text>
                  )}

                  <HoverableButton
                    variant={isActive ? 'primary' : 'secondary'}
                    fullWidth
                    disabled={isActive || loading}
                    onClick={() => processPaddleCheckout(plan)}>
                    {isActive ? 'Current Plan' : 'Upgrade'}
                  </HoverableButton>

                  <Box mt="xxl">
                    {plan.features.map((feature, id) => (
                      <CheckItem key={id}>
                        <TickIcon
                          height={18}
                          width={18}
                          color="var(--theme-ui-colors-gray-900)"
                        />
                        <Text fontSize="md">{feature}</Text>
                      </CheckItem>
                    ))}
                  </Box>
                </CardContent>
              </PlanCard>
            );
          })}
      </Flex>
    </Box>
  );
};

export default PlanList;
