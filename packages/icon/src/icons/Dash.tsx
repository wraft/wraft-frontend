import * as React from 'react';
import type { SVGProps } from 'react';
const SvgDashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="icon"
    {...props}>
    <rect
      width={14}
      height={2}
      x={5}
      y={11}
      fill={props.color || 'currentColor' || `#2C3641`}
      rx={1}
    />
  </svg>
);
export default SvgDashIcon;
