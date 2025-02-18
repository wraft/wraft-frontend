export interface Plan {
  id: string;
  name: string;
  description: string;
  features: string[];
  inserted_at: string;
  updated_at: string;
  limits: {
    instance_create: number;
    content_type_create: number;
    organisation_create: number;
    organisation_invite: number;
  };
  plan_id: string | null;
  product_id: string | null;
  billing_interval: string | null;
  currency: string | null;
  plan_amount: string;
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

export interface PlansApiResponse {
  plans: Plan[];
}
