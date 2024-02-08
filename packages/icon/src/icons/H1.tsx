import * as React from 'react';
import type { SVGProps } from 'react';
const SvgH1Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      d="M6.344 18H4.296V6.304h2.048v4.832h5.184V6.304h2.048V18h-2.048v-4.96H6.344zm11.835-9.856h-2.56v-1.84h4.528V18h-1.968z"
    />
  </svg>
);
export default SvgH1Icon;
