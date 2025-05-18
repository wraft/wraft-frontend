import { Text, Flex } from '@wraft/ui';
import { Focusable } from '@ariakit/react';
import { Check, Circle } from '@phosphor-icons/react';
import styled, { x } from '@xstyled/emotion';

import { FlowStateBlockProps } from 'utils/types/content';

// For Flow Progress Container we keep the existing styling
const FlowProgressContainer = styled(Flex)`
  min-width: fit-content;
  padding: xs sm;
  padding-right: md;
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

// Updated Breadcrumbs container
const BreadcrumbsContainer = styled.nav`
  width: 100%;
  overflow: hidden;
`;

const BreadcrumbList = styled.ol`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
`;

// Completely redesigned BreadcrumbItem based on the reference

// ${({ isActive, theme }) =>
//   isActive &&
//   `
//   font-weight: 600;
// `}
// color: ${({ theme }) => theme?.colors.white};
// background: ${({ theme }) => theme?.colors.gray['600']};
const BreadcrumbItem = styled.li<{
  isActive?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}>`
  position: relative;
  padding: 0.5rem 1.5rem;
  font-weight: 500;

  /* Default state */

  /* Different clip paths based on position */
  clip-path: ${({ isFirst, isLast }) => {
    if (isFirst)
      return 'polygon(0 0, calc(100% - 1rem) 0, 100% 50%, calc(100% - 1rem) 100%, 0 100%)';
    if (isLast) return 'polygon(0 0, 1rem 50%, 0 100%, 100% 100%, 100% 0)';
    return 'polygon(0 0, 1rem 50%, 0 100%, calc(100% - 1rem) 100%, 100% 50%, calc(100% - 1rem) 0)';
  }};

  /* Active state */

  /* After element for the triangle connector */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -0.95rem;
    top: 0;
    width: 1rem;
    height: 100%;
    clip-path: polygon(0 0, 100% 50%, 0 100%);
    z-index: 10;
  }

  /* Pending state (items after active) */
`;

const BreadcrumbLink = styled.a`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: underline;
  }
`;

const BreadcrumbSpan = styled.span`
  color: inherit;
`;

export const TriangleBreadcrumbs = ({
  items,
}: {
  items: { label: string; href?: string; isActive?: boolean }[];
}) => {
  return (
    <BreadcrumbsContainer aria-label="Breadcrumb">
      <BreadcrumbList>
        {items.map((item, index) => (
          <BreadcrumbItem
            key={index}
            isActive={item.isActive}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            aria-current={item.isActive ? 'page' : undefined}>
            {item.href ? (
              <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
            ) : (
              <BreadcrumbSpan>{item.label}</BreadcrumbSpan>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
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
      return checked ? 'green.100' : 'orange.100';
    }

    if (!checked && !activeState) {
      return 'background-secondary';
    }
    return 'green.400';
  };

  return (
    <FlowProgressContainer
      as={Focusable}
      align="center"
      className="step-holder-item"
      gap="sm"
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
        w="16px"
        h="16px"
        borderColor={activeState ? 'gray.300' : 'gray.500'}
        p="xxs"
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
            color="orange"
            className="main-icon"
          />
        )}
        {checked && <Check size={12} weight="bold" className="main-icon" />}
      </Flex>
      <Text
        color={activeState ? 'orange.500' : 'gray.a1100'}
        fontWeight="600"
        fontSize="sm2"
        textTransform="capitalize">
        {state}
      </Text>
    </FlowProgressContainer>
  );
};
