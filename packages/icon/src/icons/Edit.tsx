import * as React from 'react';
import type { SVGProps } from 'react';
const SvgEditIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || props.fontSize || 24}
    height={props.height || props.fontSize || 24}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="M5 18h4.24a1 1 0 0 0 .71-.29l6.92-6.93L19.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83-6.94 6.93a1 1 0 0 0-.29.71V17a1 1 0 0 0 1 1m9.76-13.59 2.83 2.83-1.42 1.42-2.83-2.83zM6 13.17l5.93-5.93 2.83 2.83L8.83 16H6zM21 20H3a1 1 0 0 0 0 2h18a1 1 0 0 0 0-2"
    />
  </svg>
);
export default SvgEditIcon;
