import * as React from "react";
import type { SVGProps } from "react";
const SvgLayoutAltIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2m0 2 .001 4H5V5zM5 11h8v8H5zm10 8v-8h4.001l.001 8z" />
  </svg>
);
export default SvgLayoutAltIcon;
