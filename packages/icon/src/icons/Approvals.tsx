import * as React from 'react';
import type { SVGProps } from 'react';
const SvgApprovalsIcon = (props: SVGProps<SVGSVGElement>) => (
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
      stroke={props.color || `#2C3641`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m11.984 10.4 5.628.035m-5.628 6.535 5.628.036m-5.6-3.102 5.627.036M6.325 9.69l1.622 1.622 2.266-2.264M6.325 12.98l1.622 1.62 2.266-2.263m-3.698 3.794 1.623 1.622 2.265-2.264m4.705-10.5h3.894c.551 0 .998.447.998.998v14.016c0 .55-.447.997-.998.997H4.998A1 1 0 0 1 4 20.003V5.987c0-.551.447-.998.998-.998h3.955M9.024 3H15v4.065H9.024z"
    />
  </svg>
);
export default SvgApprovalsIcon;
