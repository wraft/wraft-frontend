import { format, formatDistanceStrict } from 'date-fns';
import { Text } from '@wraft/ui';

/**
 * Props for the TimeAgo component
 * @interface TimeAgoProps
 * @property {any} [time] - The timestamp to display
 * @property {boolean} [ago] - Whether to show "ago" suffix for recent times
 * @property {boolean} [short] - Whether to use compact display
 */
interface TimeAgoProps {
  time?: any;
  ago?: boolean;
  short?: boolean;
}

/**
 * TimeAgo component displays relative or absolute time based on the input timestamp
 * @component
 * @param {TimeAgoProps} props - Component props
 * @returns {JSX.Element} Rendered component
 *
 * @example
 * // Basic usage
 * <TimeAgo time="2024-03-20T10:00:00Z" />
 *
 * @example
 * // With ago suffix
 * <TimeAgo time="2024-03-20T10:00:00Z" ago />
 *
 * @example
 * // Compact display
 * <TimeAgo time="2024-03-20T10:00:00Z" short />
 */
export const TimeAgo = (props: TimeAgoProps) => {
  // Ensure UTC timestamps without 'Z' suffix are treated as UTC
  let timeString = props.time;
  if (
    typeof props.time === 'string' &&
    !props.time.endsWith('Z') &&
    props.time.includes('T')
  ) {
    timeString = props.time + 'Z';
  }

  const date = new Date(timeString);
  const showAgo = props.ago ? true : false;
  const now = new Date();

  const timeDifferenceInMs = now.getTime() - date.getTime();

  const timed =
    timeDifferenceInMs > 24 * 60 * 60 * 1000
      ? format(date, 'MMM dd, yyyy')
      : formatDistanceStrict(date, now, { addSuffix: showAgo || false });

  return <Text mt={props?.short ? 0 : 0}>{timed}</Text>;
};
