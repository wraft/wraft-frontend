import * as React from "react";
import type { SVGProps } from "react";
const SvgBackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="icon"
    {...props}
  >
    <path fill="none" d="M0 0h24v24H0z" />
    <path d="m9 11-4 4 4 4m-4-4h11a4 4 0 0 0 0-8h-1" />
  </svg>
);
export default SvgBackIcon;
