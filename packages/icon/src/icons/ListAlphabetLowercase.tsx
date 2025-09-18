import * as React from "react";
import type { SVGProps } from "react";
const SvgListAlphabetLowercaseIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.5}
      clipPath="url(#ListAlphabetLowercase_svg__a)"
    >
      <path strokeLinejoin="round" d="M13 16h14M13 8h14M13 24h14" />
      <path d="M9 8s-.5-2-2.5-2S4 7.5 4 8.5 4.5 11 6.5 11 9 9 9 9m0 0V6m0 3v2M5 22.5s.5-2 2.5-2S10 22 10 23s-.5 2.5-2.5 2.5-2.5-2-2.5-2m0 0V16m0 7.5v2" />
    </g>
    <defs>
      <clipPath id="ListAlphabetLowercase_svg__a">
        <path fill="#fff" d="M0 0h32v32H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgListAlphabetLowercaseIcon;
