import * as React from 'react';
import type { SVGProps } from 'react';
const SvgH2Icon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M4.344 18H2.296V6.304h2.048v4.832h5.184V6.304h2.048V18H9.528v-4.96H4.344zm17.579-.016L13.811 18v-1.536l3.824-3.232c1.584-1.344 2.112-2.112 2.112-3.232 0-1.328-.72-2.08-1.952-2.08-1.28 0-2.08.896-2.096 2.4h-2.032c.016-2.56 1.648-4.224 4.128-4.224 2.496 0 4.048 1.424 4.048 3.792 0 1.632-.896 2.864-2.672 4.384l-2.112 1.808h4.864z"
    />
  </svg>
);
export default SvgH2Icon;
