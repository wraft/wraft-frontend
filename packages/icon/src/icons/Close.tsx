import * as React from 'react';
import type { SVGProps } from 'react';
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <g
      stroke={props.color || `#000000`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}>
      <path d="M18 6 6 18M6 6l12 12" />
    </g>
  </svg>
);
export default SvgClose;
