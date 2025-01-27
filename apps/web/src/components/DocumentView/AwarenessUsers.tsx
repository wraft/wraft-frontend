import { useEffect, useState } from 'react';
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

      setAwarenessUsers(newStates);
    }
  };

  return (
    <Flex px="xs">
      {awarenessUsers.map((item: any, index: any) => (
        <Box
          key={index}
          w="18px"
          h="18px"
          marginRight="-sm"
          borderColor="border"
          bg={item?.user?.color}
          borderRadius="full"
          data-name={item?.user?.name}>
          {/* Uncomment to display user name: {item?.user?.color} */}
        </Box>
      ))}
    </Flex>
  );
};

export default AwarenessUsers;
