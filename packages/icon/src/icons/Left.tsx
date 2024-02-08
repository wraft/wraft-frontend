import * as React from 'react';
import type { SVGProps } from 'react';
const SvgLeftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      fillRule="evenodd"
      d="M17.296 2.418a1.43 1.43 0 0 1 0 2.02L9.735 12l7.56 7.561a1.429 1.429 0 1 1-2.02 2.02l-8.57-8.57a1.43 1.43 0 0 1 0-2.021l8.57-8.572a1.43 1.43 0 0 1 2.02 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgLeftIcon;
