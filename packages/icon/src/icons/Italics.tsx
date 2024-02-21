import * as React from 'react';
import type { SVGProps } from 'react';
const SvgItalicsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="icon"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="M18.667 4h-8a1.333 1.333 0 1 0 0 2.667h2.026L8.427 17.333H5.333a1.333 1.333 0 0 0 0 2.667h8a1.333 1.333 0 1 0 0-2.667h-2.026l4.266-10.666h3.094a1.333 1.333 0 0 0 0-2.667"
    />
  </svg>
);
export default SvgItalicsIcon;
