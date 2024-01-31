import * as React from 'react';
import type { SVGProps } from 'react';
const SvgH2Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      fill="#2C3641"
      d="M2.344 12H.296V.304h2.048v4.832h5.184V.304h2.048V12H7.528V7.04H2.344zm17.579-.016L11.811 12v-1.536l3.824-3.232C17.219 5.888 17.747 5.12 17.747 4c0-1.328-.72-2.08-1.952-2.08-1.28 0-2.08.896-2.096 2.4h-2.032c.016-2.56 1.648-4.224 4.128-4.224 2.496 0 4.048 1.424 4.048 3.792 0 1.632-.896 2.864-2.672 4.384l-2.112 1.808h4.864z"
    />
  </svg>
);
export default SvgH2Icon;
