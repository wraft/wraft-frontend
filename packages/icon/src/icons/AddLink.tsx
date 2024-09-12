import * as React from "react";
import type { SVGProps } from "react";
const SvgAddLinkIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#343E49"
      d="M8 9h8v2H8zm12.1 1H22c0-2.76-2.24-5-5-5h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1M3.9 10c0-1.71 1.39-3.1 3.1-3.1h4V5H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M19 10h-2v3h-3v2h3v3h2v-3h3v-2h-3z"
    />
  </svg>
);
export default SvgAddLinkIcon;
