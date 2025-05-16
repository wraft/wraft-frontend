import React from 'react';
import Link from 'next/link';
import { Flex, Box, Text } from '@wraft/ui';
import { ArrowBackIcon } from '@wraft/icon';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { CaretRight, Minus } from '@phosphor-icons/react';

import Back from 'common/Back';

interface PageHeaderProps {
  children?: any;
  title: string | string[] | { name: string; path: string }[];
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
          <Link key={link.name} href={link.path}>
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
      py="md"
      px="lg"
      w="100%"
      position="sticky"
      top={0}
      zIndex={10}
      bg="background-primary">
      <Flex alignItems="center">
        {hasBack && <Back />}
        <Box display="flex" alignItems="center">
          {/* {breads && <BreadLinks links={breadLinks} />} */}
          <Flex alignContent="center" alignItems="center">
            {Array.isArray(title) ? (
              title.map((t: any, index) => (
                <Flex alignItems="center" pr="sm" key={index}>
                  {typeof t === 'object' && t.name && t.path ? (
                    <Link href={t.path} type="link">
                      <Text fontSize="base" fontWeight={500}>
                        {t.name}
                        {/* variant="secondary" */}
                      </Text>
                    </Link>
                  ) : (
                    <Text
                      color="text-primary"
                      fontSize="md"
                      fontWeight="heading"
                      display="flex"
                      pr="sm">
                      {t}
                    </Text>
                  )}
                  <Box
                    rotate="90"
                    transform="rotate(70deg)"
                    opacity="0.3"
                    fill="gray.1000"
                    color="red.700">
                    {index < title.length - 1 && (
                      <Minus size={16} fill="gray.900" />
                    )}
                  </Box>
                </Flex>
              ))
            ) : (
              <Text color="text-primary" fontSize="md" fontWeight="heading">
                {title}
              </Text>
            )}
          </Flex>
          {/* {desc && (
            <Box>
              <Text mt={0} color="text-secondary">
                {desc}
              </Text>
            </Box>
          )} */}
        </Box>
        <Box ml="auto" pt={1}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default PageHeader;
