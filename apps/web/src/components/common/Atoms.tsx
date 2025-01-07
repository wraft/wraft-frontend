import React, { FC } from 'react';
import { format, formatDistanceStrict } from 'date-fns';
import { Box, Text, Flex } from '@wraft/ui';
import { Triangle } from '@phosphor-icons/react';

import MenuItem from 'common/NavLink';

/**
 * Convert UTC date to local date
 */
interface TimeAgoProps {
  time?: any;
  ago?: boolean;
  short?: boolean;
}

export const TimeAgo = (props: TimeAgoProps) => {
  const utc_time = new Date(props.time);
  const showAgo = props.ago ? true : false;
  const offset_time_minutes = utc_time.getTimezoneOffset();
  const local_time = new Date(
    utc_time.getTime() - offset_time_minutes * 60 * 1000,
  );
  const now = new Date();

  const timeDifferenceInMs = now.getTime() - local_time.getTime();

  const timed =
    timeDifferenceInMs > 24 * 60 * 60 * 1000
      ? format(local_time, 'MMM dd, yyyy')
      : formatDistanceStrict(local_time, now, { addSuffix: showAgo || false });

  return (
    <Text fontSize="13px" color="gray.1000" mt={props?.short ? 0 : 0}>
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
      bg={active ? active : 'backgroundWhite'}
      cursor="pointer"
      px="xs"
      py="xs"
      borderBottom="solid 1px"
      borderColor="border"
      alignItems="flex-start">
      <Box
        borderRadius="3rem"
        h="12px"
        w="12px"
        border="solid 1px"
        borderColor="border"
        bg={color}
        mr={2}
        mt={2}
      />
      <Text mt={1}>{title}</Text>
    </Flex>
  );
};

/**
 * Box Wrap
 * ===
 */

interface BoxWrapProps {
  id: string;
  name: string;
  xid: string;
}

export const BoxWrap: FC<BoxWrapProps> = ({ id, xid, name }) => {
  return (
    <Box pt={1} pb={2}>
      <MenuItem variant="rel" href={`/content/[id]`} path={`content/${xid}`}>
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
        return '#fff6ab';
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
        <Text
          // variant="labelSmall"
          bg={getColor()}
          color="text"
          borderRadius="3rem"
          pl="8px"
          pt="2px"
          pb="2px"
          fontWeight="600">
          {name}
        </Text>
      )}
      {!name && (
        <Flex
          alignItems="center"
          gap="2px"
          bg="orange.50"
          borderRadius="3rem"
          py="2px"
          px={2}
          // svg: {
          //   fill: 'orange.600',
          // }
        >
          <Text
            // variant="labelSmall"
            color="orange.600"
            mr="0px"
            p={0}
            fontWeight="600">
            Draft
          </Text>

          <Triangle size={8} weight="bold" color="#FF8C02" />
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
    <Box
      {...props}
      display="flex"
      alignItems="center"
      // svg: {
      //   cursor: 'pointer',
      //   width: `${size}px`,
      //   height: `${size}px`,
      //   p: p === 'out' ? 0 : '8px',
      //   borderRadius: '9rem',
      //   bg: 'transparent',
      //   color: 'gray.400',
      //   ':hover': {
      //     bg: 'gray.100',
      //     color: 'gray.900',
      //   },
      // },
    >
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
