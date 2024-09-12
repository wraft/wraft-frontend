import * as React from "react";
import type { SVGProps } from "react";
const SvgEditIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M22 7.24a1 1 0 0 0-.29-.71l-4.24-4.24a1 1 0 0 0-.71-.29 1 1 0 0 0-.71.29l-2.83 2.83L2.29 16.05a1 1 0 0 0-.29.71V21a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .76-.29l10.87-10.93L21.71 8a1.2 1.2 0 0 0 .22-.33q.015-.12 0-.24a.7.7 0 0 0 0-.14zM6.83 20H4v-2.83l9.93-9.93 2.83 2.83zM18.17 8.66l-2.83-2.83 1.42-1.41 2.82 2.82z"
    />
  </svg>
);
export default SvgEditIcon;
