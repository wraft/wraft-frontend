import { Text, Flex } from '@wraft/ui';
import { Focusable } from '@ariakit/react';
import { Check, Circle } from '@phosphor-icons/react';
import styled from '@emotion/styled';
import { BackArrowIcon } from '@wraft/icon';

import { FlowStateBlockProps } from 'utils/types/content';

const FlowProgressContainer = styled(Flex)`
  min-width: fit-content;
  padding: 3px 6px;
  padding-right: 6px;
  &:last-child {
    border-right: 0;
    .arrowicon {
      display: none;
    }
  }

  .circlced {
    color: ${({ theme }: any) => theme?.colors.orange['300']};
  }
`;

const BreadcrumbsContainer = styled.ul`
  overflow: hidden;
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const BreadcrumbItem = styled.li`
  float: left;
  // margin: 0 0.5em 0 1em;
`;

const BreadcrumbLink = styled.a<{ isActive?: boolean }>`
  background: ${({ isActive, theme }) =>
    isActive ? theme?.colors.teal['500'] : theme?.colors.gray['200']};
  padding: 4px 6px;
  float: left;
  text-decoration: none;
  color: ${({ theme }) => theme?.colors.gray['900']};
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  position: relative;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  font-size: 14px;

  &:hover {
    background: ${({ isActive, theme }) =>
      isActive ? 'none' : theme?.colors.green['100']};
  }

  &::before {
    content: ${({ isActive }) => (isActive ? 'normal' : '""')};
    position: absolute;
    top: 50%;
    margin-top: -1.5em;
    border-width: 1.5em 0 1.5em 1em;
    border-style: solid;
    border-color: ${({ isActive, theme }) =>
      isActive
        ? 'transparent'
        : `${theme?.colors.gray['200']} ${theme?.colors.gray['200']} ${theme?.colors.gray['200']} transparent`};
    left: -1em;
  }

  &:hover::before {
    border-color: ${({ isActive, theme }) =>
      isActive
        ? 'transparent'
        : `${theme?.colors.green['100']} ${theme?.colors.green['100']} ${theme?.colors.green['100']} transparent`};
  }

  &::after {
    content: ${({ isActive }) => (isActive ? 'normal' : '""')};
    position: absolute;
    top: 50%;
    margin-top: -1.5em;
    border-top: 1.5em solid transparent;
    border-bottom: 1.5em solid transparent;
    border-left: 1em solid
      ${({ isActive, theme }) =>
        isActive ? 'transparent' : theme?.colors.gray['200']};
    right: -1em;
  }

  &:hover::after {
    border-left-color: ${({ isActive, theme }) =>
      isActive ? 'transparent' : theme?.colors.blue['100']};
  }

  &.current,
  &.current:hover {
    font-weight: bold;
    background: none;
  }

  &.current::after,
  &.current::before {
    content: normal;
  }
`;

export const TriangleBreadcrumbs = ({
  items,
}: {
  items: { label: string; href: string; isActive?: boolean }[];
}) => {
  return (
    <BreadcrumbsContainer>
      {items.map((item, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbLink
            href={item.href}
            isActive={item.isActive}
            className={item.isActive ? 'current' : ''}>
            {item.label}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </BreadcrumbsContainer>
  );
};

export const FlowProgressBar = ({
  state,
  id,
  num,
  nextState,
  currentActiveIndex,
}: FlowStateBlockProps) => {
  const checked = currentActiveIndex >= num;
  const activeState = nextState && id === nextState?.id;

  const getBgColor = () => {
    if (activeState) {
      return checked ? 'teal.100' : 'orange.100';
    }

    if (!checked && !activeState) {
      return 'background-secondary';
    }
    return 'teal.400';
  };

  return (
    <FlowProgressContainer
      as={Focusable}
      align="center"
      className="step-holder-item"
      gap="md"
      // bg="red"
      borderRight="solid 1px"
      borderColor="border"
      overflow="hidden"
      bg={activeState ? 'orange.50' : 'gray.200'}>
      <Flex
        alignItems="center"
        justify="center"
        color={
          activeState ? (checked ? 'green.1200' : 'green.400') : 'green.1200'
        }
        border="1px solid"
        borderRadius="full"
        // w="16px"
        // h="16px"
        borderColor={activeState ? 'gray.300' : 'gray.500'}
        p="xxs"
        // color="green"
        bg={getBgColor()}>
        {!checked && !activeState && (
          <Text fontSize="xs" fontWeight="heading">
            {num}
          </Text>
        )}
        {activeState && (
          <Circle
            size={12}
            weight="fill"
            color="inherit"
            className="main-icon"
          />
        )}
        {checked && <Check size={12} weight="bold" className="main-icon" />}
      </Flex>
      <Text fontWeight="heading" fontSize="sm2" textTransform="capitalize">
        {state}
      </Text>

      {/* <BackArrowIcon className="main-icon" width={20} /> */}
    </FlowProgressContainer>
  );
};
