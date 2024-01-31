import * as React from 'react';
import type { SVGProps } from 'react';
const SvgH3Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      fill="#2C3641"
      d="M2.344 12H.296V.304h2.048v4.832h5.184V.304h2.048V12H7.528V7.04H2.344zm12.875-5.792h-1.424V4.88l3.008-2.768h-4.864V.304h7.424v1.632L16.515 4.56c1.792.352 3.184 1.664 3.184 3.728 0 2.4-1.872 3.92-4.24 3.92-2.288 0-4.064-1.408-4.064-3.936h2.016c0 1.344.832 2.112 2.08 2.112 1.28 0 2.128-.832 2.128-2.128 0-1.184-.768-2.048-2.4-2.048"
    />
  </svg>
);
export default SvgH3Icon;
