import React from 'react';
import { Flex, Box, Text } from '@wraft/ui';
import { Link } from 'theme-ui';
import { ArrowBackIcon } from '@wraft/icon';

import Back from 'common/Back';

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
    <Flex py={2}>
      {props.links &&
        props.links.map((link: any) => (
          <Link
            key={link.name}
            sx={{ color: 'text-primary', fontSize: 'xs', mr: 2 }}>
            <Text pr={1}>{link.name}</Text>
            <ArrowBackIcon width={10} />
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
    <Box
      borderBottom="1px solid"
      borderColor="border"
      py="lg"
      px="lg"
      bg="background-primary">
      <Flex alignItems="center">
        {hasBack && <Back />}
        <Box>
          {breads && <BreadLinks links={breadLinks} />}
          <Text color="text-primary" fontSize="lg" fontWeight="heading">
            {title}
          </Text>
          {desc && (
            <Box>
              <Text mt={0} color="text-secondary">
                {desc}
              </Text>
            </Box>
          )}
        </Box>
        <Box ml="auto" pt={1}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default PageHeader;
