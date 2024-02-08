import * as React from 'react';
import type { SVGProps } from 'react';
const SvgFilterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}>
    <path
      stroke={props.color || `#2C3641`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M22 3H2l8 9.46V19l4 2v-8.54z"
    />
  </svg>
);
export default SvgFilterIcon;
