import React from 'react';
import { useRouter } from 'next/router';
import { Button } from 'theme-ui';

import { BackIcon } from 'components/Icons';

const Back = () => {
  const { pathname } = useRouter();
  const router = useRouter();
  return (
    <Button
      variant="base"
      onClick={() => {
        const pathSegments = pathname.split('/');
        let backRoute;

        if (pathSegments.includes('run')) {
          const index = pathSegments.indexOf('run');
          backRoute = pathSegments.slice(0, index).join('/');
        } else {
          backRoute =
            pathSegments.length > 2 ? pathSegments.slice(0, -1).join('/') : '/';
        }
        router.push(backRoute);
      }}
      sx={{ color: 'gray.400', cursor: 'pointer' }}>
      <BackIcon width={24} />
    </Button>
  );
};

export default Back;
