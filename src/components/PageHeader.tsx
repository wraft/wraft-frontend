import React from 'react';
import { Flex, Box, Text, Link } from 'theme-ui';

import { DotsVerticalRounded } from '@styled-icons/boxicons-regular/DotsVerticalRounded';
import { IosArrowRight } from '@styled-icons/fluentui-system-filled/IosArrowRight';
interface PageHeaderProps {
  children?: any;
  title: string;
  desc?: string;
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
    <Flex sx={{ py: 2}}>
      {props?.links &&
        props?.links.map((l: any) => (
          <Link sx={{ color: 'gray.6', fontSize: 0, mr: 2 }}>
            <Text sx={{ pr: 1 }}>{l.name}</Text>
            <IosArrowRight width={10} sx={{ ml: 2 }} />
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
            sx={{ color: 'gray.7', mb: 0, fontSize: 1, fontWeight: 'heading' }}>
            {title}
          </Text>
          {desc && (
            <Text
              as="h4"
              variant="pageheading"
              sx={{ fontSize: 1, mt: 0, color: 'gray.6', fontWeight: 400 }}>
              {desc}
            </Text>
          )}
        </Box>
        <Box sx={{ ml: 'auto' }}>{children}</Box>
        <Box sx={{ py: 2 }}>
          <DotsVerticalRounded width={22} />
        </Box>
      </Flex>
    </Box>
  );
};

export default PageHeader;
