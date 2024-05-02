import * as React from 'react';
import type { SVGProps } from 'react';
const SvgPasteOffIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M21.9 21.385 3.52 3.005 2.1 4.415l1.61 1.61v13.17c0 1.1.9 2 2 2h13.17l1.61 1.61zm-16.19-2.19V8.025l11.17 11.17zm12-11v-3h2v11.17l2 2V5.195c0-1.1-.9-2-2-2h-4.18c-.42-1.16-1.52-2-2.82-2s-2.4.84-2.82 2H6.54l5 5zm-5-5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1"
    />
  </svg>
);
export default SvgPasteOffIcon;
