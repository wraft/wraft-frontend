import React from 'react';

// import Back from '@wraft-ui/Back';
import { Flex, Box, Text, Link } from 'theme-ui';

import { ArrowBack, BackIcon } from './Icons';

interface PageHeaderProps {
  children?: any;
  title: string;
  desc?: any;
  breads?: boolean;
}

interface breadLinksLink {
  name?: string;
  link?: string;
}

const breadLinks: breadLinksLink[] = [
  {
    name: 'Flows',
    link: '/links/',
  },
  {
    name: 'Standard Flow',
    link: '/f/d3dx2xI',
  },
];

const BreadLinks = (props: any) => {
  return (
    <Flex sx={{ py: 2 }}>
      {props?.links &&
        props?.links.map((l: any) => (
          <Link key={l?.name} sx={{ color: 'text', fontSize: 0, mr: 2 }}>
            <Text sx={{ pr: 1 }}>{l.name}</Text>
            <ArrowBack width={10} />
          </Link>
        ))}
    </Flex>
  );
};

const PageHeader = ({ title, children, desc, breads }: PageHeaderProps) => {
  return (
    <Box variant="layout.frameHeading">
      <Flex sx={{ alignItems: 'center' }}>
        <Box sx={{ mr: 2 }}>
          <BackIcon width={24} />
        </Box>
        <Box>
          {breads && <BreadLinks links={breadLinks} />}
          <Text variant="pB" sx={{ color: 'gray.900', pb: 0, mb: 0 }}>
            {title}
          </Text>
          {desc && (
            <Box>
              <Text variant="subR" sx={{ mt: 0, color: 'gray.400' }}>
                {desc}
              </Text>
            </Box>
          )}
        </Box>
        <Box sx={{ ml: 'auto', pt: 1 }}>{children}</Box>
      </Flex>
    </Box>
  );
};

export default PageHeader;
