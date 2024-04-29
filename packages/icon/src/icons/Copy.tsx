import * as React from 'react';
import type { SVGProps } from 'react';
const SvgCopyIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#343E49"
      d="M16.5 1h-12c-1.1 0-2 .9-2 2v14h2V3h12zm3 4h-11c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16h-11V7h11z"
    />
  </svg>
);
export default SvgCopyIcon;
