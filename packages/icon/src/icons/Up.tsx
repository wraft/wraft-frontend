import * as React from 'react';
import type { SVGProps } from 'react';
const SvgUpIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      fill="#2C3641"
      fillRule="evenodd"
      d="M10.99 6.704a1.43 1.43 0 0 1 2.02 0l8.572 8.572a1.429 1.429 0 1 1-2.02 2.02L12 9.735l-7.561 7.56a1.429 1.429 0 1 1-2.02-2.02z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgUpIcon;
