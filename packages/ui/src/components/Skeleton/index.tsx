import styled, { th, x } from '@xstyled/emotion';

interface SkeletonProps {
  width?: string;
  height: string;
  borderRadius?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height,
  borderRadius = '4px',
}) => {
  const SkeletonWrapper = styled('div')`
    width: ${width};
    height: ${height || '4px'};
    border-radius;
    background-color: #E4E9EF;
    animation: skloading 1.5s infinite ease-in-out;
    @keyframes skloading {
      '0%': {
        opacity: 0.3,
      },
      '50%': {
        opacity: 0.9,
      },
      '100%': {
        opacity: 0.3,
      },
    }
  `;

  return <SkeletonWrapper className="skeleton" />;
};

export { Skeleton };
// export { Skeleton, SkeletonAvatar, SkeletonText, SkeletonButton, SkeletonContainer };
