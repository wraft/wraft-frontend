import * as React from "react";
import type { SVGProps } from "react";
const SvgListLowerRomanIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      clipPath="url(#ListLowerRoman_svg__a)"
    >
      <path d="M13 16h14M13 8h14M13 24h14M7 13V8M5 26v-5M9 26v-5M5 19v-1M9 19v-1M7 6V5" />
    </g>
    <defs>
      <clipPath id="ListLowerRoman_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgListLowerRomanIcon;
