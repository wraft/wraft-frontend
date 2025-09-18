import * as React from "react";
import type { SVGProps } from "react";
const SvgListNumbersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="icon"
    {...props}
  >
    <g
      stroke={props.color || "currentColor" || `#000000`}
      strokeWidth={1.5}
      clipPath="url(#ListNumbers_svg__a)"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h14M13 8h14M13 24h14"
      />
      <path
        strokeLinecap="round"
        d="m3 13 1.361-3.5M10 13 8.639 9.5m0 0L6.966 5.198a.5.5 0 0 0-.932 0L4.361 9.5m4.278 0H4.36"
      />
      <path d="M8 21.79c.8 0 2 .42 2 2.105C10 25.579 8.667 26 8 26H4.5a.5.5 0 0 1-.5-.5v-3.71m4 0H4m4 0s1.2-.596 1.2-2.106S7.6 18 7.6 18H4.5a.5.5 0 0 0-.5.5v3.29" />
    </g>
    <defs>
      <clipPath id="ListNumbers_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgListNumbersIcon;
