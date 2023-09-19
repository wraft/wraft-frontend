import React, { FC } from 'react';
import { Box, Text, Flex } from 'theme-ui';

import { parseISO, formatDistanceStrict } from 'date-fns';
import MenuItem from './NavLink';

/**
 * Convert UTC date to local date
 */
export function convertUTCDateToLocalDate(date: Date) {
  const newDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000,
  );

  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}
interface TimeAgoProps {
  time?: any;
  ago?: boolean;
}

export const TimeAgo = (time: TimeAgoProps) => {
  const timetime = parseISO(time.time);
  const nw = Date.now();
  const timed = formatDistanceStrict(timetime, nw, { addSuffix: true });

  // let timed1 = timed.replace(' hours ago', 'hrs');
  // timed1 = timed1.replace(' days ago', 'd');
  // timed1 = timed1.replace(' years ago', 'y');

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
        bg: 'gray.0',
        ':hover': {
          bg: 'gray.1',
          fontWeight: 400,
          color: '#000',
        },
        p: 1,
        borderBottom: 'solid 1px',
        borderColor: 'gray.3',
        alignItems: 'flex-start',
        pl: 2,
      }}>
      <Box
        sx={{
          borderRadius: '3rem',
          height: '12px',
          width: '12px',
          border: 'solid 1px',
          borderColor: 'gray.1',
          bg: color,
          mr: 2,
          // ml: 2,
          mt: 2,
        }}
      />
      <Text as="h4" sx={{ fontSize: 1, mt: 1, fontWeight: 300 }}>
        {title}
        <Text
          as="span"
          sx={{
            ml: 1,
            // pl: 2,
            bg: 'gray.3',
            fontSize: 0,
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
    <Flex sx={{ pt: 2}}>
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
