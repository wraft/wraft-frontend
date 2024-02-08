import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSortIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="m6.29 14.29-.29.3V7a1 1 0 1 0-2 0v7.59l-.29-.3a1.004 1.004 0 1 0-1.42 1.42l2 2a1 1 0 0 0 .33.21.94.94 0 0 0 .76 0 1 1 0 0 0 .33-.21l2-2a1.003 1.003 0 1 0-1.42-1.42M11 8h10a1 1 0 1 0 0-2H11a1 1 0 1 0 0 2m10 3H11a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2m0 5H11a1 1 0 0 0 0 2h10a1 1 0 0 0 0-2"
    />
  </svg>
);
export default SvgSortIcon;
