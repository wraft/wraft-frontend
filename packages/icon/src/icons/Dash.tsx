import * as React from 'react';
import type { SVGProps } from 'react';
const SvgDashIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || props.fontSize || 24}
    height={props.height || props.fontSize || 24}
    fill="none"
    {...props}>
    <rect
      width={14}
      height={2}
      x={5}
      y={11}
      fill={props.color || `#2C3641`}
      rx={1}
    />
  </svg>
);
export default SvgDashIcon;
