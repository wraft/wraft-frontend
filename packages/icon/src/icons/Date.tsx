import * as React from 'react';
import type { SVGProps } from 'react';
const SvgDateIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fill={props.color || 'currentColor' || `#000000`}
      d="M18.222 4.8h-.889V3h-1.777v1.8H8.444V3H6.667v1.8h-.89C4.792 4.8 4 5.61 4 6.6v12.6c0 .99.791 1.8 1.778 1.8h12.444C19.2 21 20 20.19 20 19.2V6.6c0-.99-.8-1.8-1.778-1.8m0 14.4H5.778v-9h12.444zm0-10.8H5.778V6.6h12.444zM7.556 12H12v4.5H7.556z"
    />
  </svg>
);
export default SvgDateIcon;
