import * as React from 'react';
import type { SVGProps } from 'react';
const SvgVariantIcon = (props: SVGProps<SVGSVGElement>) => (
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
      stroke={props.color || 'currentColor' || `#2C3641`}
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M3 4.252c0-.619.502-1.121 1.121-1.121h6.616c.62 0 1.121.502 1.121 1.121v6.632c0 .62-.502 1.121-1.12 1.121H4.12c-.619 0-1.121-.502-1.121-1.121zM14.14 4.121c0-.619.501-1.121 1.12-1.121h4.594c.619 0 1.12.502 1.12 1.121v2.326c0 .62-.501 1.121-1.12 1.121H15.26c-.62 0-1.122-.502-1.122-1.121zM14.14 10.926c0-.62.501-1.121 1.12-1.121h4.619c.619 0 1.121.502 1.121 1.121v8.953c0 .619-.502 1.121-1.121 1.121H15.26c-.62 0-1.122-.502-1.122-1.121zM3 15.589c0-.62.502-1.122 1.121-1.122h6.758c.619 0 1.121.502 1.121 1.121v4.29c0 .62-.502 1.122-1.121 1.122H4.12C3.502 21 3 20.498 3 19.879z"
    />
  </svg>
);
export default SvgVariantIcon;
