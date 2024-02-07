import * as React from 'react';
import type { SVGProps } from 'react';
const SvgTickIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || props.fontSize || 24}
    height={props.height || props.fontSize || 24}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="M19.634 6.347a1.108 1.108 0 0 0-1.617 0l-8.482 8.758-3.563-3.686a1.16 1.16 0 0 0-.829-.337 1.13 1.13 0 0 0-.816.366 1.2 1.2 0 0 0-.327.854 1.23 1.23 0 0 0 .355.843l4.372 4.508a1.14 1.14 0 0 0 .808.347 1.1 1.1 0 0 0 .809-.347l9.29-9.58q.174-.167.27-.392a1.21 1.21 0 0 0-.27-1.334"
    />
  </svg>
);
export default SvgTickIcon;
