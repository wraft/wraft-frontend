import React, { useMemo } from 'react';
import Link from 'next/link';
import { Flex, Box, Text } from '@wraft/ui';
import { Minus } from '@phosphor-icons/react';

import Back from 'common/Back';

type TitleItem = {
  name: string;
  path: string;
};

interface PageHeaderProps {
  children?: React.ReactNode;
  title: string | string[] | TitleItem[];
  desc?: React.ReactNode;
  breads?: boolean;
  hasBack?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  children,
  hasBack,
}) => {
  const renderTitle = useMemo(() => {
    if (!Array.isArray(title)) {
      return (
        <Text color="text-primary" fontSize="md" fontWeight="heading">
          {title}
        </Text>
      );
    }

    return title.map((item, index) => (
      <Flex alignItems="center" pr="sm" key={index}>
        {typeof item === 'object' && 'name' in item && 'path' in item ? (
          <Link href={item.path} passHref>
            <Text fontSize="base" fontWeight={500}>
              {item.name}
            </Text>
          </Link>
        ) : (
          <Text
            color="text-primary"
            fontSize="md"
            fontWeight="heading"
            display="flex"
            pr="sm">
            {item}
          </Text>
        )}
        {index < title.length - 1 && (
          <Box
            rotate="90"
            transform="rotate(70deg)"
            opacity="0.3"
            fill="gray.1000"
            color="red.700">
            <Minus size={16} fill="gray.900" />
          </Box>
        )}
      </Flex>
    ));
  }, [title]);

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
          <Flex alignContent="center" alignItems="center">
            {renderTitle}
          </Flex>
        </Box>
        <Box ml="auto" pt={1}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(PageHeader);
