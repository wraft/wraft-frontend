import React, { useState, useEffect } from 'react';
import { Avatar, Flex } from '@wraft/ui';
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
        alignItems="center"
        justifyContent="center"
        h={`${size + (size * 25) / 100}px`}
        w={`${size + (size * 25) / 100}px`}
        border="1px solid"
        borderColor="background-secondary"
        borderRadius="99rem"
        bg="gray.600"
      />
    );
  }
  return <Avatar src={url} alt="Workspace logo" size="sm" />;
};

export default DefaultAvatar;
