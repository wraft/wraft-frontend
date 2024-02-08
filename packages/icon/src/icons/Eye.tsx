import * as React from 'react';
import type { SVGProps } from 'react';
const SvgEyeIcon = (props: SVGProps<SVGSVGElement>) => (
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
      fillRule="evenodd"
      d="M2.574 12.708c-.18-.278-.324-.52-.433-.708a18.678 18.678 0 0 1 2.464-3.316C6.395 6.774 8.9 5 12 5s5.605 1.774 7.395 3.684A18.7 18.7 0 0 1 21.86 12a18.684 18.684 0 0 1-2.464 3.316C17.606 17.226 15.101 19 12 19s-5.604-1.774-7.395-3.684a18.7 18.7 0 0 1-2.03-2.609M23 12l.894-.448zm.894-.448c.14.282.141.614 0 .895L23 12c.894.447.894.448.894.449l-.002.002-.003.007-.011.022a11 11 0 0 1-.192.354 20.672 20.672 0 0 1-2.831 3.85C18.895 18.774 15.899 21 12 21s-6.896-2.226-8.855-4.316a20.7 20.7 0 0 1-2.831-3.85 12 12 0 0 1-.192-.354l-.011-.022-.003-.007-.002-.004L.999 12l-.893.447a1 1 0 0 1 0-.894L1 12c-.894-.447-.894-.448-.894-.449l.002-.002.003-.007.011-.022a8 8 0 0 1 .192-.354 20.674 20.674 0 0 1 2.831-3.85C5.105 5.226 8.1 3 12 3s6.895 2.226 8.855 4.316a20.7 20.7 0 0 1 2.831 3.85 12 12 0 0 1 .192.354l.011.022.003.007zM10 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0m2-4a4 4 0 1 0 0 8 4 4 0 0 0 0-8"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgEyeIcon;
