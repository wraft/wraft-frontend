import * as React from 'react';
import type { SVGProps } from 'react';
const SvgEllipsisHIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.fontSize || props.width || 24}
    height={props.height || props.fontSize || props.width || 24}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m14 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
    />
  </svg>
);
export default SvgEllipsisHIcon;
