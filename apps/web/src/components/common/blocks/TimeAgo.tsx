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

  return <Text mt={props?.short ? 0 : 0}>{timed}</Text>;
};
