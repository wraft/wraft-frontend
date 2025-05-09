import Link from 'next/link';
import styled, { th, x } from '@xstyled/emotion';
import { Box, Flex, Text } from '@wraft/ui';

interface BlockProps {
  title: string;
  icon: React.ReactNode;
  desc?: any;
  clean?: boolean;
}

interface StyledFlexProps {
  isClean?: boolean;
}

const ListParent = styled.ulBox`
  margin-top: 0;
  margin-bottom: 0;
  padding-inline-start: 0;
  list-style: none;
  border: solid 1px;
`;

const List = styled.liBox`
  &:hover {
    background-color: ${th.color('gray.400')};
  }
  transition: background-color 150ms;
  border-bottom: solid 1px;
  &:last-child {
    border-bottom: 0;
  }
`;

const FlexStyled = styled('div')<StyledFlexProps>`
  padding: xs;
  align-items: center;
  gap: sm;
  flex: 1;
  border: solid 1px;
  border-color: ${({ isClean }) =>
    isClean ? 'transparent' : th.color('gray.400')};
  // border-bottom: ${({ isClean }) => (isClean ? 0 : 'transparent')};
  border-right: ${({ isClean }) => (isClean ? 0 : 'transparent')};
  display: flex;
  align-items: center;
`;

const Pane = styled.divBox`
  margin-top: 3px;
  svg: {
    fill: green.400;
  }
`;

const Block = ({ title, icon, desc, clean }: BlockProps) => (
  <FlexStyled isClean={clean}>
    <Flex alignItems="center" gap="xs">
      <Pane color="">{icon}</Pane>
      <Text lineHeight={1} m={0}>
        {title}
      </Text>
    </Flex>
    {desc && (
      <Text fontSize="sm" lineHeight={1} m={0} color="gray.800">
        {desc}
      </Text>
    )}
  </FlexStyled>
);

const BlockSection = ({ data }: any) => {
  const formatKey = (key: string) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

  if (data === null || data === undefined) return null;

  const renderValue = (value: any, keyPrefix = '') => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      return (
        <Text key={keyPrefix} m="0" fontSize="sm" color="text-secondary">
          {String(value)}
        </Text>
      );
    }

    if (Array.isArray(value)) {
      return value.map((item, idx) => (
        <Box key={`${keyPrefix}-${idx}`} ml="md">
          {renderValue(item, `${keyPrefix}-${idx}`)}
        </Box>
      ));
    }

    if (typeof value === 'object') {
      return Object.entries(value).map(([subKey, subVal]) => (
        <Flex key={`${keyPrefix}-${subKey}`} gap="sm" mb="sm">
          <Text fontWeight="heading" fontSize="sm" m="0">
            {formatKey(subKey)}:
          </Text>
          <Box>{renderValue(subVal, `${keyPrefix}-${subKey}`)}</Box>
        </Flex>
      ));
    }

    return null;
  };

  const root = typeof data === 'object' ? data : { Value: data };

  return (
    <Box px="sm" py="sm">
      {Object.entries(root).map(([key, value]) => (
        <Flex key={key} gap="sm" mb="sm">
          <Text fontWeight="heading" fontSize="sm" m="0">
            {formatKey(key)}:
          </Text>
          <Box>{renderValue(value, key)}</Box>
        </Flex>
      ))}
    </Box>
  );
};

/**
 * For listing imported Structs
 */

interface ImportedItem {
  id: string;
  title?: string;
  name?: string;
  item_type: string;
  created_at: string;
}

interface ImportedListProps {
  items?: ImportedItem[];
}

const pathMapping = {
  data_template: 'templates/edit',
  variant: 'variants',
  flows: 'manage/flows',
  theme: 'manage/themes',
  layout: 'manage/layouts',
};

const ImportedList = ({ items }: ImportedListProps) => (
  <ListParent borderColor="border">
    {Array.isArray(items) &&
      items.map((item, _i) => (
        <List
          key={item.id}
          px={3}
          py={2}
          display="flex"
          borderWidth={0}
          borderColor="border"
          borderBottomWidth={1}>
          <Box pl={1} flex={1} display="flex">
            <Link
              href={`/${pathMapping[item.item_type as keyof typeof pathMapping]}/${item.id}`}>
              <Text fontSize="sm" lineHeight={1} m={0} color={'gray.1200'}>
                {item.title || item.name}
              </Text>
            </Link>
            <x.span
              fontSize="xs"
              lineHeight={1}
              m={0}
              ml="auto"
              mr={3}
              color={'gray.1100'}>
              {item.item_type}
            </x.span>
          </Box>
        </List>
      ))}
  </ListParent>
);

export { Block as default, ImportedList, ListParent, List, BlockSection };
