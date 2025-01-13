import * as React from "react";
import type { SVGProps } from "react";
const SvgBackArrowIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export default SvgBackArrowIcon;
