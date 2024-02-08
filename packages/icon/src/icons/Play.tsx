import * as React from 'react';
import type { SVGProps } from 'react';
const SvgPlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="M7.545 7.68 14.253 12l-6.708 4.32zM6.541 3.99A1 1 0 0 0 5 4.832v14.336a1 1 0 0 0 1.54.841l11.152-7.168a1 1 0 0 0 0-1.682z"
    />
  </svg>
);
export default SvgPlayIcon;
