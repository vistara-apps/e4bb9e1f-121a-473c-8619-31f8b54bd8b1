'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CREDIT_PACKAGES, CreditPackageId } from '@/lib/stripe';
import { formatCurrency } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';
import { CreditCard, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreditPurchaseProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreditPurchase({ onSuccess, onCancel }: CreditPurchaseProps) {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<CreditPackageId>('STANDARD');

  const handlePurchase = async (packageId: CreditPackageId) => {
    if (!user) {
      toast.error('Please log in to purchase credits');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          packageId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment');
      }

      // Initialize Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      if (!stripe) {
        throw new Error('Failed to load Stripe');
      }

      // Redirect to Stripe Checkout
      const { error } = await stripe.confirmPayment({
        clientSecret: result.data.clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // If we get here, payment was successful
      await refreshUser();
      toast.success('Credits purchased successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getPackageIcon = (packageId: CreditPackageId) => {
    switch (packageId) {
      case 'BASIC':
        return <Zap className="w-6 h-6" />;
      case 'STANDARD':
        return <CreditCard className="w-6 h-6" />;
      case 'PREMIUM':
        return <Star className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getPackageColor = (packageId: CreditPackageId) => {
    switch (packageId) {
      case 'BASIC':
        return 'border-blue-200 bg-blue-50';
      case 'STANDARD':
        return 'border-green-200 bg-green-50';
      case 'PREMIUM':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Purchase Credits
        </h2>
        <p className="text-text-secondary">
          You need credits to search for legal rights. Choose a package below.
        </p>
        {user && (
          <p className="text-sm text-text-secondary mt-2">
            Current credits: <span className="font-medium">{user.paidCredits}</span>
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {Object.entries(CREDIT_PACKAGES).map(([key, pkg]) => {
          const packageId = key as CreditPackageId;
          const isSelected = selectedPackage === packageId;
          
          return (
            <Card
              key={packageId}
              className={`p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-accent border-accent' 
                  : 'hover:border-gray-300'
              } ${getPackageColor(packageId)}`}
              onClick={() => setSelectedPackage(packageId)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    packageId === 'BASIC' ? 'bg-blue-100 text-blue-600' :
                    packageId === 'STANDARD' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {getPackageIcon(packageId)}
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">{pkg.name}</h3>
                    <p className="text-sm text-text-secondary">{pkg.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-text-primary">
                    {formatCurrency(pkg.price)}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {pkg.credits} credits
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={() => handlePurchase(selectedPackage)}
          loading={isLoading}
          className="flex-1"
        >
          Purchase {CREDIT_PACKAGES[selectedPackage].name}
        </Button>
        {onCancel && (
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </div>

      <div className="text-xs text-text-secondary text-center">
        Secure payment powered by Stripe. Your payment information is encrypted and secure.
      </div>
    </div>
  );
}
