import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Button, Text, Flex, Field, InputText } from '@wraft/ui';

import { useAuth } from 'contexts/AuthContext';
import { postAPI } from 'utils/models';

interface props {
  setOpen: any;
  setCreatedId?: any;
}
interface FormInputs {
  name: string;
  url: string;
}

const WorkspaceCreate = ({ setOpen, setCreatedId }: props) => {
  const [creating, setCreating] = useState<boolean>(false);
  const { userProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    setCreating(true);
    const body = {
      name: data.name,
      email: userProfile.email,
    };
    postAPI('organisations', body)
      .then((response: any) => {
        setOpen(false);
        toast.success('Created new workspace', {
          duration: 1000,
          position: 'top-right',
        });
        setCreatedId(response.id);
        setCreating(false);
      })
      .catch(() => {
        toast.error('Workspace creation failed!', {
          duration: 1000,
          position: 'top-right',
        });
      });
  };

  return (
    <Box as={'form'} onSubmit={handleSubmit(onSubmit)} minWidth="556px">
      <Text fontSize="2xl" as="h3" mb="lg">
        Create workspace
      </Text>

      <Field label="Workspace Name" required error={errors?.name?.message}>
        <InputText {...register('name')} placeholder="Enter Workspace Name" />
      </Field>

      <Flex gap="md" mt="md">
        <Button loading={creating} type="submit">
          Create Workspace
        </Button>
        <Button variant="tertiary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export default WorkspaceCreate;
