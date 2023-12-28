import React from 'react';
import { Flex, Box, Text, Link } from 'theme-ui';

import { ArrowBack } from './Icons';
interface PageHeaderProps {
  children?: any;
  title: string;
  // desc?: string;
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
          <Link key={l?.name} sx={{ color: 'gray.6', fontSize: 0, mr: 2 }}>
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
      <Flex>
        <Box>
          {breads && <BreadLinks links={breadLinks} />}
          <Text
            as="h1"
            variant="pageheading"
            sx={{ color: 'gray.9', mb: 0, fontSize: 2, fontWeight: 'heading' }}>
            {title}
          </Text>
          {desc && (
            <Text
              as="h4"
              variant="pageheading"
              sx={{ fontSize: 1, mt: 0, color: 'gray.4', fontWeight: 400 }}>
              {desc}
            </Text>
          )}
        </Box>
        <Box sx={{ ml: 'auto', pt: 1 }}>{children}</Box>
        {/* <Box sx={{ py: 2 }}>
          <DotsVerticalRounded width={22} />
        </Box> */}
      </Flex>
    </Box>
  );
};

export default PageHeader;
