import * as React from 'react';
import type { SVGProps } from 'react';
const SvgMultipleChoiceIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 24}
    height={props.height || 24}
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="icon"
    {...props}>
    <circle
      cx={12}
      cy={12}
      r={7.25}
      stroke={props.color || `#2C3641`}
      strokeWidth={1.5}
    />
    <circle cx={12} cy={12} r={5} fill="#343E49" />
  </svg>
);
export default SvgMultipleChoiceIcon;
