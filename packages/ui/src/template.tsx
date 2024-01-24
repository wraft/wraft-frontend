// template.tsx
import React, { SVGProps } from 'react';

export interface MyComponentProps extends SVGProps<SVGSVGElement> {
  // Add your custom props here
}

const MyComponent: React.FC<MyComponentProps> = (props) => {
  return (
    // Your SVG component JSX here
    <svg {...props}>
      {/* SVG content */}
    </svg>
  );
};

export default MyComponent;
