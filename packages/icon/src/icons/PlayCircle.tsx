import * as React from "react";
import type { SVGProps } from "react";
const SvgPlayCircleIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2m0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8" />
    <path d="m9 17 8-5-8-5z" />
  </svg>
);
export default SvgPlayCircleIcon;
