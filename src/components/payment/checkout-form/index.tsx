import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCreatePaymentIntent } from '@/hooks/queries/payment-hooks';
import { formatPrice } from '@/utils/format';
import type { PaymentData } from '@/types/db/payment';

interface CheckoutFormProps {
  onSuccess: () => void;
  paymentData: PaymentData;
  totalAmount: number;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, paymentData, totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { mutate: createPaymentIntent, isPending: isCreatingIntent } = useCreatePaymentIntent();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setError('Card number element not found');
      return;
    }

    try {
      setError(null);
      
      // Step 1: Create PaymentMethod
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Failed to create payment method');
        toast.error(paymentMethodError.message || 'Payment method creation failed');
        return;
      }

      // Step 2: Create PaymentIntent with our backend
      createPaymentIntent(
        {
          amount: totalAmount,
          paymentId: paymentData.payment.id,
          paymentMethodId: paymentMethod.id
        },
        {
          onSuccess: async (intentResponse) => {
            if (intentResponse.isSuccess && intentResponse.data) {
              const { clientSecret } = intentResponse.data;
              
              if (!clientSecret) {
                setError('No client secret received');
                toast.error('Payment setup failed');
                return;
              }

              // Step 3: Confirm payment with Stripe
              const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id
              });

              if (confirmError) {
                setError(confirmError.message || 'Payment confirmation failed');
                toast.error(confirmError.message || 'Payment failed');
              } else {
                toast.success('Payment successful! 🎉');
                setOpen(false);
                onSuccess();
              }
            } else {
              setError('Failed to create payment intent');
              toast.error('Payment setup failed');
            }
          },
          onError: (error: Error) => {
            setError('Payment processing failed');
            toast.error('Payment processing failed');
            console.error('Payment intent error:', error);
          }
        }
      );
    } catch (error) {
      setError('An unexpected error occurred');
      toast.error('Payment failed');
      console.error('Payment error:', error);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          Proceed to Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
        </DialogHeader>
        <div className="bg-muted p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-primary">{formatPrice(totalAmount)}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Card Number
            </label>
            <div className="border rounded-md p-3 bg-white">
              <CardNumberElement options={cardStyle} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Expiry Date
              </label>
              <div className="border rounded-md p-3 bg-white">
                <CardExpiryElement options={cardStyle} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                CVC
              </label>
              <div className="border rounded-md p-3 bg-white">
                <CardCvcElement options={cardStyle} />
              </div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded">
              {error}
            </div>
          )}
          
          <Button
            type="submit"
            disabled={!stripe || isCreatingIntent}
            className="w-full"
            size="lg"
          >
            {isCreatingIntent ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
