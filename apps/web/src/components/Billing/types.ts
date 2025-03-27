export interface Coupon {
  amount: string;
  coupon_code: string;
  coupon_id: string;
  currency: string;
  description: string;
  expiry_date: string | null;
  id: string;
  maximum_recurring_intervals: number | null;
  name: string;
  recurring: boolean;
  status: string;
  times_used: number;
  type: string;
  usage_limit: number | null;
}

export interface PlanLimits {
  instance_create: number;
  content_type_create: number;
  organisation_create: number;
  organisation_invite: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  inserted_at: string;
  updated_at: string;
  limits: PlanLimits;
  plan_id: string | null;
  product_id: string | null;
  billing_interval: string | null;
  currency: string | null;
  plan_amount: string;
  coupon: Coupon | null;
  coupon_id: string | null;
}

export interface Subscription {
  id: string;
  status: string;
  plan: Plan;
  start_date: string;
  end_date: string;
  next_bill_date: string;
  next_bill_amount: string;
  transaction_id: string;
}

export interface Subscriber {
  email: string;
  email_verify: boolean;
  id: string;
  inserted_at: string;
  name: string;
  updated_at: string;
}

export interface PaymentMethodDetails {
  card: {
    cardholder_name: string;
    expiry_month: number;
    expiry_year: number;
    last4: string;
    type: string;
  };
  type: string;
}

export interface Transaction {
  id: string;
  invoice_number: string;
  billing_period_start: string;
  billing_period_end: string;
  currency: string;
  date: string;
  payment_method_details: PaymentMethodDetails;
  plan: Plan;
  plan_id: string;
  provider_plan_id: string;
  provider_subscription_id: string;
  subscriber: Subscriber;
  subscriber_id: string;
  subtotal_amount: string;
  tax: string;
  total_amount: string;
  transaction_id: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface TransactionApiResponse extends ApiResponse {
  transactions: Transaction[];
}

export interface PlansApiResponse {
  plans: Plan[];
}
