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
    <Flex alignItems="center" gap="sm">
      <Pane>{icon}</Pane>
      <Text lineHeight={1}>{title}</Text>
    </Flex>
    {desc && (
      <Text fontSize="sm" color="gray.900">
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
      return <Text key={keyPrefix}>{String(value)}</Text>;
    }

    if (Array.isArray(value)) {
      return value.map((item, idx) => (
        <Box key={`${keyPrefix}-${idx}`} ml="md">
          {renderValue(item, `${keyPrefix}-${idx}`)}
        </Box>
      ));
    }

    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([subKey, subVal]) => (
        <Flex key={`${keyPrefix}-${subKey}`} gap="sm" mb="sm">
          <Text fontWeight="heading" fontSize="sm">
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
    <Box py="md" px="lg">
      {Object.entries(root).map(([key, value]) => (
        <Flex key={key} gap="md" mb="sm">
          <Text color="text-secondary">{formatKey(key)}:</Text>
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
          px="md"
          py="sm"
          display="flex"
          borderColor="border"
          borderBottom="solid 1px">
          <Box pl="sm" flex={1} display="flex">
            <Link
              href={`/${pathMapping[item.item_type as keyof typeof pathMapping]}/${item.id}`}>
              <Text fontSize="sm" color={'gray.1200'}>
                {item.title || item.name}
              </Text>
            </Link>
            <x.span fontSize="xs" ml="auto" mr="md" color={'gray.1100'}>
              {item.item_type}
            </x.span>
          </Box>
        </List>
      ))}
  </ListParent>
);

export { Block as default, ImportedList, ListParent, List, BlockSection };
