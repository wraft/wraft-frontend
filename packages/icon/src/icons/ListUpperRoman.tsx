import * as React from "react";
import type { SVGProps } from "react";
const SvgListUpperRomanIcon = (props: SVGProps<SVGSVGElement>) => (
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
      clipPath="url(#ListUpperRoman_svg__a)"
    >
      <path d="M13 16h14M13 8h14M13 24h14M7 13V5v1M5 26v-8 1M9 26v-8 1" />
    </g>
    <defs>
      <clipPath id="ListUpperRoman_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgListUpperRomanIcon;
