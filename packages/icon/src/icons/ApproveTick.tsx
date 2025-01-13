import * as React from "react";
import type { SVGProps } from "react";
const SvgApproveTickIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 14 15"
    aria-hidden="true"
    role="icon"
    {...props}
  >
    <rect width={14} height={14} y={0.5} fill="currentColor" rx={7} />
    <path
      fill="#fff"
      d="M9.863 5.302a.43.43 0 0 0-.304-.135.4.4 0 0 0-.303.135l-3.18 3.405-1.337-1.433a.43.43 0 0 0-.31-.131.41.41 0 0 0-.307.142.47.47 0 0 0-.122.332.5.5 0 0 0 .133.328l1.64 1.753a.43.43 0 0 0 .303.135.4.4 0 0 0 .303-.135l3.484-3.725a.484.484 0 0 0 0-.671"
    />
  </svg>
);
export default SvgApproveTickIcon;
