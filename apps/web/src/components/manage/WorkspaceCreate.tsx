import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Button, Text, Spinner } from 'theme-ui';

import Field from 'common/Field';
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
    <Box
      as={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ minWidth: '556px' }}>
      <Text variant="pB" sx={{ display: 'inline-block', py: 3, px: 4 }}>
        Create workspace
      </Text>
      <Box sx={{ borderTop: '1px solid', borderColor: 'border' }}>
        <Box sx={{ px: 4, pt: 3 }}>
          <Field
            name="name"
            register={register}
            placeholder="Enter Workspace Name"
            label="Workspace Name"
            error={errors.name}
          />
          <Box sx={{ gap: 3, py: 4 }}>
            <Button
              type="submit"
              variant="buttonPrimary"
              sx={{
                fontSize: 'sm',
                flexGrow: 1,
                mr: 3,
              }}>
              {creating && <Spinner width={16} height={16} color="white" />}
              {!creating && <Text>Create Workspace</Text>}
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="cancel"
              sx={{
                fontSize: 'sm',
                flexGrow: 1,
              }}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WorkspaceCreate;
