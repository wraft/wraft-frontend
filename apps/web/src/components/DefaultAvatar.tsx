import React, { useState, useEffect } from 'react';
import { Image, Flex } from 'theme-ui';
import { toSvg } from 'jdenticon';

interface DefaultAvatarProps {
  url: string | undefined;
  value: string | undefined;
  size: number;
}

const DefaultAvatar = ({ url, value, size }: DefaultAvatarProps) => {
  const [isDummyImage, setIsDummyImage] = useState<boolean>(false);

  const containsPathSegment = (imgUrl: string, segment: string): boolean => {
    return imgUrl.includes(segment);
  };

  useEffect(() => {
    if (url) {
      const expectedPath = '/public/images/logo.png';
      const pathMatches = containsPathSegment(url, expectedPath);
      if (pathMatches) {
        setIsDummyImage(true);
      } else {
        setIsDummyImage(false);
      }
    }
  }, [url]);

  if (isDummyImage) {
    return (
      <Flex
        dangerouslySetInnerHTML={{
          __html: toSvg(value, size),
        }}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '99rem',
          height: `${size + (size * 25) / 100}px`,
          width: `${size + (size * 25) / 100}px`,
          border: '1px solid',
          borderColor: 'background-secondary',
          p: '3px',
          bg: 'gray.600',
        }}
      />
    );
  }
  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '99rem',
        height: `${size + 4}px`,
        width: `${size + 4}px`,
        border: '1px solid',
        borderColor: 'gray.200',
        overflow: 'hidden',
        bg: 'gray.600',
      }}>
      <Image
        src={url}
        alt="Workspace logo"
        sx={{
          borderRadius: '99rem',
          objectFit: 'cover',
          height: `${size}px`,
          width: `${size}px`,
        }}
      />
    </Flex>
  );
};

export default DefaultAvatar;
