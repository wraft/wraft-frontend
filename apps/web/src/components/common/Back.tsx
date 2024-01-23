import React from 'react';

import { useRouter } from 'next/router';
import { Button } from 'theme-ui';

import { ArrowBack } from '../Icons';

const Back = () => {
  const { pathname } = useRouter();
  const router = useRouter();
  return (
    <Button
      variant="base"
      onClick={() => {
        const pathSegments = pathname.split('/');
        const backRoute =
          pathSegments.length > 2 ? pathSegments.slice(0, -1).join('/') : '/';
        router.push(backRoute);
      }}
      sx={{ color: 'gray.400', cursor: 'pointer' }}>
      <ArrowBack width={20} />
    </Button>
  );
};

export default Back;