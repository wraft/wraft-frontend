import React, { FC } from 'react';
import { Box, Text, Flex } from 'theme-ui';

import { formatDistanceStrict } from 'date-fns';
import MenuItem from './NavLink';

/**
 * Convert UTC date to local date
 */
interface TimeAgoProps {
  time?: any;
  ago?: boolean;
}

export const TimeAgo = (props: TimeAgoProps) => {
  const utc_time = new Date(props.time);
  const offset_time_minutes = utc_time.getTimezoneOffset();
  const addOffset =
    offset_time_minutes > 0
      ? offset_time_minutes * 60 * 1000
      : offset_time_minutes * -60 * 1000;

  const local_time = new Date(utc_time.getTime() + addOffset);
  const now = new Date();
  const timed = formatDistanceStrict(local_time, now, { addSuffix: true });

  return (
    <Text
      pl={0}
      sx={{
        fontSize: '12px',
        fontWeight: 500,
        '.hov': { opacity: 0 },
        ':hover': { '.hov': { opacity: 1 } },
      }}
      color="gray.6">
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
      sx={{
        width: '16px',
        height: '16px',
        bg: props?.bg,
        // border: "solid 1px #ddd",
        position: 'absolute',
        top: '45%',
        right: 3,
        padding: '5px',
        // background: "#fff",
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      }}
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
  no: number;
  color?: string;
}

/**
 * Filter Atom
 * @param param0
 * @returns
 */
export const FilterBlock: FC<FilterBlockProps> = ({ title, no, color }) => {
  return (
    <Flex
      sx={{
        bg: 'bgWhite',
        cursor: 'pointer',
        ':hover': {
          bg: 'neutral.1',
          fontWeight: 400,
          color: 'gray.8',
        },
        p: 1,
        borderBottom: 'solid 1px',
        borderColor: 'neutral.1',
        alignItems: 'flex-start',
        pl: 2,
      }}>
      <Box
        sx={{
          borderRadius: '3rem',
          height: '12px',
          width: '12px',
          border: 'solid 1px',
          borderColor: 'neutral.0',
          bg: color,
          mr: 2,
          // ml: 2,
          mt: 2,
        }}
      />
      <Text as="h4" sx={{ fontSize: 2, mt: 1, fontWeight: 500 }}>
        {title}
        <Text
          as="span"
          sx={{
            ml: 1,
            // pl: 2,
            bg: 'neutral.1',
            fontSize: '10px',
            fontWeight: 'heading',
            color: 'gray.7',
            // border: 'solid 0.5px',
            borderColor: 'gray.5',
            p: 1,
            pt: '4px',
            pb: '4px',
            borderRadius: '3rem',
            px: '4px',
            py: '1px',
          }}>
          {no}
        </Text>
      </Text>
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
    <Box sx={{ pt: 1, pb: 2 }}>
      <MenuItem variant="rel" href={`/content/[id]`} path={`content/${xid}`}>
        <Text
          sx={{
            fontSize: 0,
            color: 'gray.6',
            fontWeight: 300,
            cursor: 'pointer',
          }}>
          {id}
        </Text>
        <Text
          as="h4"
          p={0}
          sx={{
            color: 'gray.9',
            m: 0,
            fontSize: 2,
            fontWeight: 500,
            cursor: 'pointer',
          }}>
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
  return (
    <Flex sx={{ pt: 2 }}>
      <Text
        pt={0}
        variant="labelSmall"
        sx={{
          bg: color ? color : 'red',
          color: '#005517',
          borderRadius: '3rem',
          pl: '8px',
          pt: '2px',
          pb: '2px',
          fontWeight: '600',
        }}>
        {name}
      </Text>
    </Flex>
  );
};
