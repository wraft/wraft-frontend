import * as React from "react";
import type { SVGProps } from "react";
const SvgDragIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M11.4 5.25c0 1.243-.985 2.25-2.2 2.25S7 6.493 7 5.25 7.985 3 9.2 3s2.2 1.007 2.2 2.25M11.4 12c0 1.243-.985 2.25-2.2 2.25S7 13.243 7 12s.985-2.25 2.2-2.25 2.2 1.007 2.2 2.25M11.4 18.75c0 1.243-.985 2.25-2.2 2.25S7 19.993 7 18.75s.985-2.25 2.2-2.25 2.2 1.007 2.2 2.25M18 5.25c0 1.243-.985 2.25-2.2 2.25s-2.2-1.007-2.2-2.25S14.585 3 15.8 3 18 4.007 18 5.25M18 12c0 1.243-.985 2.25-2.2 2.25s-2.2-1.007-2.2-2.25.985-2.25 2.2-2.25S18 10.757 18 12M18 18.75c0 1.243-.985 2.25-2.2 2.25s-2.2-1.007-2.2-2.25.985-2.25 2.2-2.25 2.2 1.007 2.2 2.25"
    />
  </svg>
);
export default SvgDragIcon;
