import * as React from 'react';
import type { SVGProps } from 'react';
const SvgMailIcon = (props: SVGProps<SVGSVGElement>) => (
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
      stroke={props.color || 'currentColor' || `#000000`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M5.6 5.6h12.8c.88 0 1.6.72 1.6 1.6v9.6c0 .88-.72 1.6-1.6 1.6H5.6c-.88 0-1.6-.72-1.6-1.6V7.2c0-.88.72-1.6 1.6-1.6"
    />
    <path
      stroke={props.color || 'currentColor' || `#000000`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="m20 7.2-8 5.6-8-5.6"
    />
  </svg>
);
export default SvgMailIcon;
