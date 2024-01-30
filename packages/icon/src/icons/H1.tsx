import * as React from 'react';
import type { SVGProps } from 'react';
const SvgH1 = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      fill="#2C3641"
      d="M2.344 12H.296V.304h2.048v4.832h5.184V.304h2.048V12H7.528V7.04H2.344zm11.835-9.856h-2.56V.304h4.528V12h-1.968z"
    />
  </svg>
);
export default SvgH1;
