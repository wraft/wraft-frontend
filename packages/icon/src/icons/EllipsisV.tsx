import * as React from "react";
import type { SVGProps } from "react";
const SvgEllipsisVIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill={props.color || "currentColor" || `#2C3641`}
      d="M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0-7a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
    />
  </svg>
);
export default SvgEllipsisVIcon;
