import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrowDownIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#000000`}
      d="M17.71 11.29a1 1 0 0 0-1.42 0L13 14.59V7a1 1 0 0 0-2 0v7.59l-3.29-3.3a1.004 1.004 0 1 0-1.42 1.42l5 5q.144.137.33.21a.94.94 0 0 0 .76 0 1 1 0 0 0 .33-.21l5-5a1 1 0 0 0 0-1.42"
    />
  </svg>
);
export default SvgArrowDownIcon;