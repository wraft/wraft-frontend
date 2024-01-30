import * as React from 'react';
import type { SVGProps } from 'react';
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 25}
    height={props.height || 25}
    fill="none"
    {...props}>
    <path
      fill="#2C3641"
      fillRule="evenodd"
      d="M4.8 11.1a6.3 6.3 0 1 1 10.837 4.37 1 1 0 0 0-.166.167A6.3 6.3 0 0 1 4.8 11.1m11.356 6.329a8.1 8.1 0 1 1 1.273-1.273l3.307 3.308a.9.9 0 1 1-1.273 1.272z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgSearch;
