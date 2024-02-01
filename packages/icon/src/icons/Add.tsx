import * as React from 'react';
import type { SVGProps } from 'react';
const SvgAddIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      stroke="#2C3641"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.485 12H3.515M12 3.515v16.97"
    />
  </svg>
);
export default SvgAddIcon;
