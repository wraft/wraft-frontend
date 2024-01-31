import * as React from 'react';
import type { SVGProps } from 'react';
const SvgBoldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <g
      stroke="#2C3641"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}>
      <path d="M6 12h9a4 4 0 1 1 0 8H6zM6 4h8a4 4 0 1 1 0 8H6z" />
    </g>
  </svg>
);
export default SvgBoldIcon;
