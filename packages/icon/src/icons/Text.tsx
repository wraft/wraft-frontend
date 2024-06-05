import * as React from 'react';
import type { SVGProps } from 'react';
const SvgTextIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill={props.color || 'currentColor' || `#2C3641`}
      d="M5 8h2V6h3.252L7.68 18H5v2h8v-2h-2.252L13.32 6H17v2h2V4H5z"
    />
  </svg>
);
export default SvgTextIcon;
