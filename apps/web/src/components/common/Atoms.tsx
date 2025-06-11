import React, { FC } from 'react';
import { format, formatDistanceStrict } from 'date-fns';
import { Box, Text, Flex } from '@wraft/ui';
import { Triangle } from '@phosphor-icons/react';
import styled from '@xstyled/emotion';
import { FormatDistanceToken, formatDistanceToNowStrict } from 'date-fns';

import MenuItem from 'common/NavLink';

const formatDistanceLocale: Record<
  FormatDistanceToken,
  (count: number) => string
> = {
  lessThanXSeconds: (c) => `${c}s`,
  xSeconds: (c) => `${c}s`,
  halfAMinute: () => '30s',
  lessThanXMinutes: (c) => `${c}m`,
  xMinutes: (c) => `${c}m`,
  aboutXHours: (c) => `${c}h`,
  xHours: (c) => `${c}h`,
  xDays: (c) => `${c}d`,
  aboutXWeeks: (c) => `${c}w`,
  xWeeks: (c) => `${c}w`,
  aboutXMonths: (c) => `${c}m`,
  xMonths: (c) => `${c}m`,
  aboutXYears: (c) => `${c}y`,
  xYears: (c) => `${c}y`,
  overXYears: (c) => `${c}y`,
  almostXYears: (c) => `${c}y`,
};

/**
 * Convert UTC date to local date
 */
interface TimeAgoProps {
  time?: any;
  ago?: boolean;
  short?: boolean;
  fontSize?: 'sm' | 'md' | 'lg' | 'sm2';
}

export const TimeAgo = (props: TimeAgoProps) => {
  const utc_time = new Date(props.time);
  const showAgo = props.ago ? true : false;
  const offset_time_minutes = utc_time.getTimezoneOffset();
  const local_time = new Date(
    utc_time.getTime() - offset_time_minutes * 60 * 1000,
  );
  const now = new Date();
  const fontSize = props.fontSize || 'sm2';

  const timeDifferenceInMs = now.getTime() - local_time.getTime();

  const timed =
    timeDifferenceInMs > 24 * 60 * 60 * 1000
      ? format(local_time, 'MMM dd, yyyy')
      : formatDistanceToNowStrict(local_time, {
          addSuffix: showAgo || false,
          locale: {
            formatDistance: (token, count) =>
              formatDistanceLocale[token](count),
          },
        });

  return (
    <Text mt={props?.short ? 0 : 0} fontSize={fontSize} opacity="0.8">
      {timed}
    </Text>
  );
};

/**
 * Color Block
 * ======
 * Color picker for standard color picker operations
 */

export const ColorBlock = (props: any) => {
  return (
    <Box
      {...props}
      width="16px"
      height="16px"
      bg={props?.bg}
      position="absolute"
      top="45%"
      right={3}
      padding="5px"
      borderRadius="1px"
      boxShadow="0 0 0 1px rgba(0,0,0,.1)"
      display="inline-block"
      cursor="pointer"
    />
  );
};

/**
 * Content Cards
 * ======
 *
 */

interface FilterBlockProps {
  title: string;
  // no: number;
  color?: string;
  setSelected?: any;
  active?: string;
}

/**
 * Filter Atom
 * @param param0
 * @returns
 */
export const FilterBlock: FC<FilterBlockProps> = ({
  title,
  // no,
  color,
  setSelected,
  active,
}) => {
  return (
    <Flex
      onClick={() => setSelected(title)}
      bg={active ? active : 'background-primary'}
      cursor="pointer"
      px="sm"
      py="xs"
      gap="sm"
      borderBottom="solid 1px"
      borderColor="border"
      align="center">
      <VariantLine bg={color || '#555'} />
      <Text fontWeight={500} mt={1}>
        {title}
      </Text>
    </Flex>
  );
};

/**
 * @deprecated
 * Box Wrap
 */

interface BoxWrapProps {
  id: string;
  name: string;
  xid: string;
}

export const BoxWrap: FC<BoxWrapProps> = ({ id, xid, name }) => {
  return (
    <Box pt={1} pb={2}>
      <MenuItem variant="rel" href={`/documents/[id]`} path={`content/${xid}`}>
        <Text fontSize="xs" color="text" fontWeight="300" cursor="pointer">
          {id}
        </Text>
        <Text
          as="h4"
          p={0}
          color="text"
          m={0}
          fontSize="sm"
          fontWeight="500"
          cursor="pointer">
          {name}
        </Text>
      </MenuItem>
    </Box>
  );
};

/**
 * State Badge
 * ===
 *
 */

interface StateBadgeProps {
  color: string;
  name: string;
}

export const StateBadge: FC<StateBadgeProps> = ({ color, name }) => {
  const getColor = () => {
    switch (name) {
      case 'Draft':
        return 'gray.500';
      case 'Review':
        return 'orange.100';
      case 'Publish':
        return 'green.400';
      case 'custom':
        return color || 'blue';
      case null:
        return 'blue.100';
      default:
        return 'red';
    }
  };

  return (
    <Flex pt={2}>
      {name && (
        <Text bg={getColor()} fontSize="sm" borderRadius="xxl" px="md" py="sx">
          {name}
        </Text>
      )}
      {!name && (
        <Flex
          alignItems="center"
          gap="xs"
          bg="orange.50"
          borderRadius="3rem"
          py="sx"
          px="md">
          <Text color="orange.600" fontSize="sm" mr="0px">
            Draft
          </Text>

          <Triangle size={10} weight="bold" color="#FF8C02" />
        </Flex>
      )}
    </Flex>
  );
};

/**
 * Temporary Wrapper for Icons
 */
interface IconWrapperProps {
  content?: string;
  children: any;
  p?: any;
  size?: any;
  stroke?: number;
}

export const IconWrapper = ({
  children,
  p = 'in',
  size = '32',
  stroke = 2,
  ...props
}: IconWrapperProps) => {
  return (
    <Box {...props} display="flex" alignItems="center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1rem"
        height="1rem"
        viewBox="0 0 24 24"
        strokeWidth={stroke}
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <>{children}</>
      </svg>
    </Box>
  );
};

/**
 * Re usable page frame
 */

export const PageInner = ({ children }: { children: any }) => {
  return (
    <Flex direction="column" gap="md" my="md" px="xxl" py="lg" mx="auto">
      {children}
    </Flex>
  );
};
/*
 *
 * Icon Wrapper for Phosphor Icons
 */
interface IconWrapperProps {
  color?: string;
  children: any;
}

const IconWrapped = styled(Box)`
  color: ${(props) => props.color};
  svg {
    fill: ${(props) => props.color};
  }
`;

export const IconFrame = ({ color, children }: IconWrapperProps) => {
  return (
    <IconWrapped color={color} display="flex" alignItems="center">
      {children}
    </IconWrapped>
  );
};

/**
 * x
 */

interface VariantLineProps {
  bg: string;
}

export const VariantLine = ({ bg }: VariantLineProps) => {
  return (
    <Box
      as="span"
      display="block"
      borderRadius="3px"
      h="12px"
      w="6px"
      border="solid 1px"
      borderColor="border"
      alignItems="center"
      bg={bg}
    />
  );
};
