import React from 'react';
import { CloseIcon } from '@wraft/icon';
import { Avatar, Button, Flex, Text } from 'theme-ui';

type Props = {
  person: any;
  close?: (e: any) => void;
};

const PersonCapsule = ({ person, close }: Props) => {
  const { name, src } = person;
  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        bg: 'neutral.200',
        px: 2,
        py: '6px',
        borderRadius: '20px',
      }}>
      <Flex sx={{ alignItems: 'center' }}>
        <Avatar src={src} width={16} />
        <Text variant="subR" ml={'6px'}>
          {name}
        </Text>
      </Flex>
      {close && (
        <Button ml={2} variant="base" onClick={close}>
          <CloseIcon />
        </Button>
      )}
    </Flex>
  );
};

export default PersonCapsule;
