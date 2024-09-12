import * as React from "react";
import type { SVGProps } from "react";
const SvgDoxIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill={props.color || "currentColor" || `#2C3641`}
      fillRule="evenodd"
      d="M3.879 1.879A3 3 0 0 1 6 1h8a1 1 0 0 1 .707.293l6 6A1 1 0 0 1 21 8v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 .879-2.121M6 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.414L13.586 3z"
      clipRule="evenodd"
    />
    <path
      fill={props.color || "currentColor" || `#2C3641`}
      fillRule="evenodd"
      d="M14 1a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-6a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"
      clipRule="evenodd"
    />
    <path
      fill={props.color || "currentColor" || `#2C3641`}
      d="M8 8a1 1 0 0 0 0 2h2a1 1 0 1 0 0-2zM7 13a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1M7 17a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1"
    />
  </svg>
);
export default SvgDoxIcon;
