import * as React from "react";
import type { SVGProps } from "react";
const SvgThreeDotIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 36 18"
    aria-hidden="true"
    role="icon"
    {...props}
  >
    <circle cx={8.5} cy={8.5} r={2.5} fill="#C1C6DB" />
    <circle cx={17.5} cy={8.5} r={2.5} fill="#C1C6DB" />
    <circle cx={26.5} cy={8.5} r={2.5} fill="#C1C6DB" />
  </svg>
);
export default SvgThreeDotIcon;
