import React, { FC } from 'react';
import { format, formatDistanceStrict } from 'date-fns';
import { Box, Text, Flex } from 'theme-ui';

import MenuItem from './NavLink';

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
    <Text
      variant="pM"
      sx={{ fontSize: '13px', color: 'gray.1000', mt: props?.short ? 0 : 0 }}>
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
      sx={{
        bg: active ? active : 'backgroundWhite',
        cursor: 'pointer',
        ':hover': {
          bg: 'neutral.200',
          fontWeight: 400,
          color: 'text',
        },
        p: 1,
        borderBottom: 'solid 1px',
        borderColor: 'border',
        alignItems: 'flex-start',
        pl: 2,
      }}>
      <Box
        sx={{
          borderRadius: '3rem',
          height: '12px',
          width: '12px',
          border: 'solid 1px',
          borderColor: 'border',
          bg: color,
          mr: 2,
          // ml: 2,
          mt: 2,
        }}
      />
      <Text as="h4" sx={{ fontSize: 'sm', mt: 1, fontWeight: 500 }}>
        {title}
        {/* <Text
          as="span"
          sx={{
            ml: 1,
            // pl: 2,
            bg: 'neutral.200',
            fontSize: 'xxs',
            fontWeight: 'heading',
            color: 'text',
            // border: 'solid 0.5px',
            borderColor: 'border',
            p: 1,
            pt: '4px',
            pb: '4px',
            borderRadius: '3rem',
            px: '4px',
            py: '1px',
          }}>
          {no}
        </Text> */}
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
            fontSize: 'xxs',
            color: 'text',
            fontWeight: 300,
            cursor: 'pointer',
          }}>
          {id}
        </Text>
        <Text
          as="h4"
          p={0}
          sx={{
            color: 'text',
            m: 0,
            fontSize: 'sm',
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
      default:
        return 'red';
    }
  };
  return (
    <Flex sx={{ pt: 2 }}>
      <Text
        pt={0}
        variant="labelSmall"
        sx={{
          bg: getColor(),
          color: 'text',
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
      sx={{
        display: 'flex',
        alignItems: 'center',
        svg: {
          cursor: 'pointer',
          width: `${size}px`,
          height: `${size}px`,
          p: p === 'out' ? 0 : '8px',
          borderRadius: '9rem',
          bg: 'transparent',
          color: 'gray.400',
          ':hover': {
            bg: 'gray.100',
            color: 'gray.900',
          },
        },
      }}>
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
