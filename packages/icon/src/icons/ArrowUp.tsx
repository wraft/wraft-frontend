import * as React from 'react';
import type { SVGProps } from 'react';
const SvgArrowUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.fontSize || props.width || 24}
    height={props.height || props.fontSize || props.width || 24}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="m17.71 11.29-5-5a1 1 0 0 0-.33-.21 1 1 0 0 0-.76 0 1 1 0 0 0-.33.21l-5 5a1.004 1.004 0 1 0 1.42 1.42L11 9.41V17a1 1 0 0 0 2 0V9.41l3.29 3.3a1.002 1.002 0 0 0 1.639-.325 1 1 0 0 0-.219-1.095"
    />
  </svg>
);
export default SvgArrowUpIcon;
