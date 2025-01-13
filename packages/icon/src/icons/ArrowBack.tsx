import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowBackIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
  </svg>
);
export default SvgArrowBackIcon;
