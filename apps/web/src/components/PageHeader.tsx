import React from 'react';
import Back from '@wraft-ui/Back';
import { Flex, Box, Text, Link } from 'theme-ui';

import { ArrowBack } from './Icons';

interface PageHeaderProps {
  children?: any;
  title: string;
  desc?: any;
  breads?: boolean;
  hasBack?: boolean;
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
      {props.links &&
        props.links.map((l: any) => (
          <Link key={l.name} sx={{ color: 'text', fontSize: 0, mr: 2 }}>
            <Text sx={{ pr: 1 }}>{l.name}</Text>
            <ArrowBack width={10} />
          </Link>
        ))}
    </Flex>
  );
};

const PageHeader = ({
  title,
  children,
  desc,
  breads,
  hasBack,
}: PageHeaderProps) => {
  return (
    <Box variant="layout.frameHeading">
      <Flex sx={{ alignItems: 'center' }}>
        {hasBack && <Back />}
        <Box>
          {breads && <BreadLinks links={breadLinks} />}
          <Text as={'p'} variant="pB" sx={{ color: 'gray.1200', pb: 0, mb: 0 }}>
            {title}
          </Text>
          {desc && (
            <Box>
              <Text as={Box} variant="subR" sx={{ mt: 0, color: 'gray.900' }}>
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
