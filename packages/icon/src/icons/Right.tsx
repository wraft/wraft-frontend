import * as React from 'react';
import type { SVGProps } from 'react';
const SvgRightIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      fillRule="evenodd"
      d="M6.418 2.418a1.43 1.43 0 0 1 2.02 0l8.572 8.572a1.43 1.43 0 0 1 0 2.02L8.44 21.582a1.429 1.429 0 1 1-2.02-2.02L13.978 12 6.42 4.439a1.43 1.43 0 0 1 0-2.02"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgRightIcon;
