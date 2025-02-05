import { fetchAPI } from 'utils/models';

import { Subscription } from './types';

export const fetchSubscription = async (): Promise<Subscription> => {
  try {
    const subscriptionData = (await fetchAPI('billing/subscription/')) as Subscription;
    return subscriptionData;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};
