import * as React from 'react';
import type { SVGProps } from 'react';
const SvgManageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || props.fontSize || 24}
    height={props.height || props.fontSize || 24}
    fill="none"
    {...props}>
    <path
      stroke={props.color || `#2C3641`}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m17.907 6.044 2.941-2.927M17.278 3 21 3.02m-.034 3.717.03-3.717m-3.09 14.936 2.942 2.928m-3.57.116L21 20.98m-.034-3.717.03 3.717M6.093 17.956l-2.942 2.928m3.57.116L3 20.98m.034-3.717-.03 3.717m3.09-14.936L3.15 3.117M6.721 3 3 3.02m.034 3.717-.03-3.717m7.169 4.639c0-1.007.817-1.822 1.824-1.822a1.823 1.823 0 1 1-1.824 1.822M7.619 13.92c0-2.215 1.96-4.01 4.378-4.01s4.38 1.795 4.38 4.01l-.01 1.872-8.676-.06s-.072.17-.072-1.812"
    />
  </svg>
);
export default SvgManageIcon;
