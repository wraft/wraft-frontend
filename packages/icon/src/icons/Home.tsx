import * as React from 'react';
import type { SVGProps } from 'react';
const SvgHomeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    {...props}>
    <path
      fill={props.color || `#2C3641`}
      fillRule="evenodd"
      d="M12.614 1.21a1 1 0 0 0-1.228 0l-9 7A1 1 0 0 0 2 9v11a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a1 1 0 0 0-.386-.79zM16 21h3a1 1 0 0 0 1-1V9.49l-8-6.223-8 6.222V20a1 1 0 0 0 1 1h3v-9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1zm-6 0v-8h4v8z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgHomeIcon;
