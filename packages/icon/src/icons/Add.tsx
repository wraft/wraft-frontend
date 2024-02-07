import * as React from 'react';
import type { SVGProps } from 'react';
const SvgAddIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.fontSize || props.width || 24}
    height={props.height || props.fontSize || props.width || 24}
    fill="none"
    {...props}>
    <path
      stroke={props.color || `#2C3641`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.485 12H3.515M12 3.515v16.97"
    />
  </svg>
);
export default SvgAddIcon;
