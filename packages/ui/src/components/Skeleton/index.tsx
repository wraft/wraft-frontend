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
  const keyframes = {
    '@keyframes loading': {
      '0%': {
        opacity: 0.3,
      },
      '50%': {
        opacity: 0.9,
      },
      '100%': {
        opacity: 0.3,
      },
    },
  };

  const style = {
    minWidth: width,
    minHeight: height,
    borderRadius,
    backgroundColor: '#E4E9EF',
    animation: 'loading 1.5s infinite ease-in-out',
    mb: '8px',
    ...keyframes,
  };

  return <x.div className="skeleton" {...style} />;
};


export { Skeleton };
// export { Skeleton, SkeletonAvatar, SkeletonText, SkeletonButton, SkeletonContainer };