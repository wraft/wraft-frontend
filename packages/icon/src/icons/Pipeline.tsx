import * as React from 'react';
import type { SVGProps } from 'react';
const SvgPipelineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || props.fontSize || 24}
    height={props.height || props.fontSize || 24}
    fill="none"
    {...props}>
    <path
      stroke={props.color || `#2C3641`}
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m12.01 6.803-.005 3.324M6.71 12.006l3.315.019m3.796-.007 3.492-.047m-5.316 2.019v3.205m-1.934-5.176a1.865 1.865 0 1 1 3.73.001 1.865 1.865 0 0 1-3.73-.001Zm7.206-.057a1.865 1.865 0 1 1 3.73.002 1.865 1.865 0 0 1-3.73-.002Zm-7.128-7.097a1.865 1.865 0 1 1 3.73.002 1.865 1.865 0 0 1-3.73-.002ZM3 12.018a1.865 1.865 0 1 1 3.73.001A1.865 1.865 0 0 1 3 12.018Zm7.141 7.118a1.865 1.865 0 1 1 3.73.002 1.865 1.865 0 0 1-3.73-.002Z"
    />
  </svg>
);
export default SvgPipelineIcon;
