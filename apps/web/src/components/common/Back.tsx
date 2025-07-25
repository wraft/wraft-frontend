import React from 'react';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@wraft/icon';

import { useAuth } from 'contexts/AuthContext';

interface BackProps {
  fallbackRoute?: string | ((isAuthenticated: boolean) => string);
  size?: number;
  showText?: boolean;
  className?: string;
}

const Back: React.FC<BackProps> = ({
  fallbackRoute = (isAuthenticated: boolean) =>
    isAuthenticated ? '/' : '/login',
  size = 24,
  showText = false,
  className,
}) => {
  const { pathname, back } = useRouter();
  const router = useRouter();
  const { accessToken } = useAuth();

  const handleBack = () => {
    if (window.history.length > 1) {
      back();
    } else {
      const pathSegments = pathname.split('/').filter(Boolean);
      let backRoute;

      if (pathSegments.includes('run')) {
        const index = pathSegments.indexOf('run');
        backRoute = pathSegments.slice(0, index).join('/') || '/';
      } else if (pathSegments.length > 1) {
        backRoute = '/' + pathSegments.slice(0, -1).join('/');
      } else {
        const isAuthenticated = !!accessToken;
        backRoute =
          typeof fallbackRoute === 'function'
            ? fallbackRoute(isAuthenticated)
            : fallbackRoute;
      }

      router.push(backRoute);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={className}
      aria-label="Go back"
      style={{
        background: 'none',
        border: 'none',
        padding: '8px',
        color: '#9CA3AF',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: showText ? '8px' : 0,
        transition: 'all 0.2s ease',
        borderRadius: '4px',
        fontSize: 'inherit',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#4B5563';
        e.currentTarget.style.transform = 'translateX(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#9CA3AF';
        e.currentTarget.style.transform = 'translateX(0)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateX(-1px)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'translateX(-2px)';
      }}>
      <ArrowLeftIcon width={size} height={size} color="#9CA3AF" />
      {showText && (
        <span style={{ fontSize: '14px', fontWeight: 500 }}>Back</span>
      )}
    </button>
  );
};

export default Back;
