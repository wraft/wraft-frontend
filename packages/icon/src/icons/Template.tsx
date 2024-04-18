import * as React from 'react';
import type { SVGProps } from 'react';
const SvgTemplateIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 19 19"
    aria-hidden="true"
    role="icon"
    {...props}>
    <path
      stroke={props.color || 'currentColor' || `#2C3641`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5.25 1v11.05a1.7 1.7 0 0 0 1.7 1.7H18M13.75 18V6.95a1.7 1.7 0 0 0-1.7-1.7H1"
    />
  </svg>
);
export default SvgTemplateIcon;
