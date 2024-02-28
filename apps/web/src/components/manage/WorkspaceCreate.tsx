import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Button, Text } from 'theme-ui';

import { useAuth } from '../../contexts/AuthContext';
import { postAPI } from '../../utils/models';
import Field from '../Field';

interface props {
  setOpen: any;
  setCreatedId?: any;
}
interface FormInputs {
  name: string;
  url: string;
}

const WorkspaceCreate = ({ setOpen, setCreatedId }: props) => {
  const { userProfile } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    const body = {
      name: data.name,
      url: data.url,
      email: userProfile.email,
    };
    postAPI('organisations', body)
      .then((data: any) => {
        setOpen(false);
        toast.success('Created new workspace', {
          duration: 1000,
          position: 'top-right',
        });
        setCreatedId(data.id);
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
            placeholder="Functionary"
            label="Workspace Name"
            error={errors.name}
          />
          <Box sx={{ pt: 2 }}>
            <Field
              name="url"
              register={register}
              placeholder="wraft.co/functionary"
              label="Workspace URL"
              error={errors.url}
            />
          </Box>
          <Box sx={{ gap: 3, py: 4 }}>
            <Button
              type="submit"
              variant="buttonPrimary"
              sx={{
                fontSize: 2,
                flexGrow: 1,
                mr: 3,
              }}>
              Create Workspace
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="cancel"
              sx={{
                fontSize: 2,
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
