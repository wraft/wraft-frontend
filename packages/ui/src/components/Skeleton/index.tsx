import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  variant?: "pulse" | "wave" | "shimmer";
  rounded?: boolean;
  animate?: boolean;
}

const getAnimationStyles = (variant: string): string => {
  const animations = {
    pulse: `
      animation: pulse 1.5s ease-in-out infinite;
      @keyframes pulse {
        0% { opacity: 0.3; }
        50% { opacity: 0.7; }
        100% { opacity: 0.3; }
      }
    `,
    wave: `
      position: relative;
      overflow: hidden;
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: wave 1.5s linear infinite;
      }
      @keyframes wave {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `,
    shimmer: `
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 2s linear infinite;
      @keyframes shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `,
  };
  return animations[variant] || animations.pulse;
};

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  variant = "pulse",
  rounded = false,
  animate = true,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    backgroundColor: "#E4E9EF",
    borderRadius: rounded ? "9999px" : "4px",
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    ...style,
  };

  if (animate) {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = getAnimationStyles(variant);
    document.head.appendChild(styleSheet);
  }

  return <div style={baseStyles} {...props} />;
};

export { Skeleton };
