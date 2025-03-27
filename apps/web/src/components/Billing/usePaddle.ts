import { useState, useEffect } from 'react';

interface InitOptions {
  token: string;
  environment?: 'sandbox' | 'production';
  onCheckoutSuccess?: (data: any) => void;
}

interface CheckoutOptions {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customData?: Record<string, string | number>;
  discountId: string | undefined;
}

export const usePaddle = ({
  token,
  environment = 'sandbox',
  onCheckoutSuccess,
}: InitOptions) => {
  const [paddleError, setPaddleError] = useState<string | null>(null);
  const [isPaddleReady, setIsPaddleReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;

    script.onload = () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const Paddle = (window as any).Paddle;
        if (!Paddle) throw new Error('Paddle SDK not available');

        Paddle.Environment.set(environment || 'sandbox');
        Paddle.Initialize({
          token,
          eventCallback: function (data: any) {
            if (data.name === 'checkout.completed') {
              setTimeout(() => {
                if (onCheckoutSuccess) onCheckoutSuccess(data);
                Paddle.Checkout.close();
              }, 2000);
            }
          },
        });
        setIsPaddleReady(true);
      } catch (err) {
        console.error('Paddle Initialization Error:', err);
        setPaddleError('Failed to initialize Paddle');
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [token, environment]);

  const handleCheckout = async (options: CheckoutOptions) => {
    if (!isPaddleReady) {
      setPaddleError('Paddle is not initialized');
      return;
    }

    try {
      await window.Paddle.Checkout.open(options);
    } catch (err) {
      setPaddleError('Failed to open checkout');
      console.error('Checkout error:', err);
    }
  };

  return {
    handleCheckout,
    paddleError,
    isPaddleReady,
  };
};
