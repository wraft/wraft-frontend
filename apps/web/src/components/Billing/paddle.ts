import { useState, useEffect } from 'react';

interface PaddleInitOptions {
  token: string;
  environment?: 'sandbox' | 'production';
}

interface CheckoutOptions {
  items: Array<{
    priceId: string;
    quantity: number;
  }>;
  customData?: Record<string, string | number>;
}

export const usePaddleIntegration = (initOptions: PaddleInitOptions) => {
  const [paddleError, setPaddleError] = useState<string | null>(null);
  const [isPaddleReady, setIsPaddleReady] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
    script.async = true;

    script.onload = () => {
      try {
        window.Paddle.Environment.set(initOptions.environment || 'sandbox');
        window.Paddle.Initialize({
          token: initOptions.token,
        });
        setIsPaddleReady(true);
      } catch (err) {
        setPaddleError('Failed to initialize Paddle');
        console.error(err);
      }
    };

    script.onerror = () => {
      setPaddleError('Failed to load Paddle script');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [initOptions.token, initOptions.environment]);

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
