import * as React from 'react';
import type { SVGProps } from 'react';
const SvgDocumentsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="icon"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="M17.333 4H5.667C4.747 4 4 4.747 4 5.667v11.666C4 18.253 4.747 19 5.667 19h6.666a.83.83 0 0 0 .59-.244l5.833-5.834a.8.8 0 0 0 .163-.244c.012-.025.018-.05.028-.077a.8.8 0 0 0 .042-.216c.002-.018.011-.034.011-.052V5.667C19 4.747 18.253 4 17.333 4M5.667 5.667h11.666V11.5h-5a.833.833 0 0 0-.833.833v5H5.667zm7.5 10.488v-2.988h2.988z"
    />
  </svg>
);
export default SvgDocumentsIcon;
