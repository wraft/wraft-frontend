import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Box, Flex } from '@wraft/ui';

import { useDocument } from './DocumentContext';

const AwarenessUsers = () => {
  const [awarenessUsers, setAwarenessUsers] = useState<any>([]);
  const { editorRef } = useDocument();

  useEffect(() => {
    if (editorRef.current?.provider) {
      editorRef.current?.provider.awareness.on('change', handleChange);
    }
    return () => {
      editorRef.current?.provider.awareness.off('change', handleChange);
    };
  }, [editorRef.current]);

  const handleChange = () => {
    const user = editorRef.current?.provider.awareness.getStates().values();
    if (user) {
      const newStates = Array.from(
        editorRef.current?.provider.awareness.getStates().values(),
      );

      const uniqueUsers = newStates.filter(
        (state: any, index: number, self: any[]) =>
          index ===
          self.findIndex(
            (s: any) =>
              s.user?.id === state.user?.id ||
              s.user?.name === state.user?.name,
          ),
      );

      setAwarenessUsers(uniqueUsers);
    }
  };

  console.log(
    'awareness',
    awarenessUsers.map((item: any) => item.user),
  );

  return (
    <Flex px="xs">
      {awarenessUsers.map((item: any, index: any) => (
        <>
          <Box
            key={index}
            w="22px"
            h="22px"
            marginRight="-sm"
            border="2px solid"
            borderColor={item?.user?.color || 'border'}
            overflow="hidden"
            bg={item?.user?.color}
            borderRadius="full"
            data-name={item?.user?.name}>
            {item?.user?.image && (
              <Image
                src={item?.user?.image}
                width={20}
                height={20}
                alt={item?.user?.name}
              />
            )}
          </Box>
        </>
      ))}
    </Flex>
  );
};

export default AwarenessUsers;
