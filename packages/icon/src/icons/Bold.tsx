import * as React from "react";
import type { SVGProps } from "react";
const SvgBoldIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="icon"
    {...props}
  >
    <path
      stroke={props.color || "currentColor" || `#2C3641`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 12h9a4 4 0 1 1 0 8H6zm0 0h8a4 4 0 1 0 0-8H6z"
    />
  </svg>
);
export default SvgBoldIcon;
