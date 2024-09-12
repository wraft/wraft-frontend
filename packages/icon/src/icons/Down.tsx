import * as React from "react";
import type { SVGProps } from "react";
const SvgDownIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M2.418 6.704a1.43 1.43 0 0 1 2.02 0L12 14.265l7.561-7.56a1.429 1.429 0 1 1 2.02 2.02l-8.57 8.57a1.43 1.43 0 0 1-2.021 0l-8.572-8.57a1.43 1.43 0 0 1 0-2.02"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgDownIcon;
