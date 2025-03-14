import { useState, useEffect } from 'react';

interface InitOptions {
  token: string;
  environment?: 'sandbox' | 'production';
}

interface CheckoutOptions {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customData?: Record<string, string | number>;
  discountId: string | undefined;
}

export const usePaddle = (Paddle: InitOptions) => {
  const [paddleError, setPaddleError] = useState<string | null>(null);
  const [isPaddleReady, setIsPaddleReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;

    script.onload = () => {
      try {
        window.Paddle.Environment.set(Paddle.environment || 'sandbox');
        window.Paddle.Initialize({
          token: Paddle.token,
        });
        setIsPaddleReady(true);
      } catch (err) {
        setPaddleError('Failed to initialize Paddle');
        console.error(err);
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [Paddle.token, Paddle.environment]);

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
