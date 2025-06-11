import styled from "@xstyled/emotion";

interface SkeletonProps {
  width?: string;
  height: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = "100%", height }) => {
  const SkeletonWrapper = styled("div")`
    width: ${width};
    height: ${height || "4px"};
    border-radius: 4px;
    background: linear-gradient(
      90deg,
      var(--theme-ui-colors-gray-300) 0%,
      var(--theme-ui-colors-gray-400) 50%,
      var(--theme-ui-colors-gray-300) 100%
    );
    background-size: 200% 100%;
    animation: shineEffect 1.5s infinite ease-in-out;

    @keyframes shineEffect {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  `;

  return <SkeletonWrapper className="skeleton" />;
};

export { Skeleton };
// export { Skeleton, SkeletonAvatar, SkeletonText, SkeletonButton, SkeletonContainer };
