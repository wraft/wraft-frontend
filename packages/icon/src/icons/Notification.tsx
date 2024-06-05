import * as React from 'react';
import type { SVGProps } from 'react';
const SvgNotificationIcon = (props: SVGProps<SVGSVGElement>) => (
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
      stroke={props.color || 'currentColor' || `#2C3641`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.989}
      d="M13.53 20.703a1.99 1.99 0 0 1-3.441 0m7.687-12.928a5.967 5.967 0 0 0-11.933 0c0 6.962-2.984 8.95-2.984 8.95h17.9s-2.983-1.988-2.983-8.95"
    />
  </svg>
);
export default SvgNotificationIcon;
