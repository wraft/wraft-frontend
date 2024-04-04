import * as React from 'react';
import type { SVGProps } from 'react';
const SvgTimeIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill={props.color || `#2C3641`}
      d="M11.992 4C7.576 4 4 7.584 4 12s3.576 8 7.992 8C16.416 20 20 16.416 20 12s-3.584-8-8.008-8M12 18.4A6.4 6.4 0 0 1 5.6 12c0-3.536 2.864-6.4 6.4-6.4s6.4 2.864 6.4 6.4-2.864 6.4-6.4 6.4M12.4 8h-1.2v4.8l4.2 2.52.6-.984-3.6-2.136z"
    />
  </svg>
);
export default SvgTimeIcon;
