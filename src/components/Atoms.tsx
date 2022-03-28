import React from 'react';
import { Box, Text } from 'theme-ui';

import { parseISO, formatDistanceStrict } from 'date-fns';

/**
 * Convert UTC date to local date
 */
 export function convertUTCDateToLocalDate(date: Date) {
  var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

  var offset = date.getTimezoneOffset() / 60;
  var hours = date.getHours();

  newDate.setHours(hours - offset);

  return newDate;
}


export const TimeAgo = (time: any) => {
  const timetime = parseISO(time.time);
  const nw = Date.now();
  const timed = formatDistanceStrict(timetime, nw, { addSuffix: true });

  let timed1 = timed.replace(' hours ago', 'h');
  timed1 = timed1.replace(' days ago', 'd');
  timed1 = timed1.replace(' years ago', 'y');

  return (
    <Text
      pl={0}
      pt="3px"
      sx={{
        fontSize: 0,
        fontWeight: 400,
        '.hov': { opacity: 0 },
        ':hover': { '.hov': { opacity: 1 } },
      }}
      color="gray.6">
      {timed1}
    </Text>
  );
};


/**
 * Color Block
 * ======
 * Color picker for standard color picker operations
 */

export const ColorBlock = (props: any) => {
  return(
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
  )
}