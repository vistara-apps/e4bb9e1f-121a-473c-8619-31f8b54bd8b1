import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Credit packages configuration
export const CREDIT_PACKAGES = {
  BASIC: {
    id: 'basic',
    name: 'Basic Package',
    credits: 5,
    price: 100, // $1.00 in cents
    description: '5 legal rights lookups'
  },
  STANDARD: {
    id: 'standard',
    name: 'Standard Package',
    credits: 15,
    price: 250, // $2.50 in cents
    description: '15 legal rights lookups'
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium Package',
    credits: 50,
    price: 700, // $7.00 in cents
    description: '50 legal rights lookups'
  }
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;
