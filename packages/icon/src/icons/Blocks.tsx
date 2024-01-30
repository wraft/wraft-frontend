import * as React from 'react';
import type { SVGProps } from 'react';
const SvgBlocks = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={props.width || 25}
    height={props.height || 25}
    fill="currentColor"
    data-color="red"
    viewBox="0 0 20 24"
    {...props}>
    <path d="M5 8h2V6h3.252L7.68 18H5v2h8v-2h-2.252L13.32 6H17v2h2V4H5z" />
  </svg>
);
export default SvgBlocks;
