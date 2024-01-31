import * as React from 'react';
import type { SVGProps } from 'react';
const SvgItalicsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      fill="#2C3641"
      d="M17 6h-6a1 1 0 1 0 0 2h1.52l-3.2 8H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-1.52l3.2-8H17a1 1 0 1 0 0-2"
    />
  </svg>
);
export default SvgItalicsIcon;
