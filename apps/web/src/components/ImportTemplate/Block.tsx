import Link from 'next/link';
// import { Check } from '@phosphor-icons/react';
import styled, { th, x } from '@xstyled/emotion';

import { Box } from 'common/Box';
import { Text } from 'common/Text';

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
  padding: ${th.space(2)};
  align-items: center;
  gap: ${th.space(2)};
  flex: 1;
  border: solid 1px;
  border-color: ${({ isClean }) =>
    isClean ? 'transparent' : th.color('gray.400')};
  border-bottom: ${({ isClean }) => (isClean ? 0 : 'transparent')};
  border-right: ${({ isClean }) => (isClean ? 0 : 'transparent')};
  display: flex;
`;

const Pane = styled.divBox`
  svg: {
    fill: green.400;
  }
`;

const Block = ({ title, icon, desc, clean }: BlockProps) => (
  <FlexStyled isClean={clean}>
    <Pane color="">{icon}</Pane>
    <Text fontSize="sm" lineHeight={1} m={0}>
      {title}
    </Text>
    {desc && (
      <Text fontSize="xs" lineHeight={1} m={0} color="gray.800">
        {desc}
      </Text>
    )}
  </FlexStyled>
);

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
          {/* <x.div>
            <Check size={12} color="border" />
          </x.div> */}
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

export { Block as default, ImportedList, ListParent, List };
