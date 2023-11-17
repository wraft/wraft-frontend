import React from 'react';
import { Box, Button, Text } from 'theme-ui';
import Field from '../Field';
import { useForm } from 'react-hook-form';
import { createEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import { useToasts } from 'react-toast-notifications';

interface props {
  setOpen: any;
  setRerender: any;
}
interface FormInputs {
  name: string;
  url: string;
}

const WorkspaceCreate = ({ setOpen, setRerender }: props) => {
  const token = useStoreState((state) => state.auth.token);
  const { addToast } = useToasts();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onChange',
  });
  const profile = useStoreState((state) => state.profile.profile);

  function onSuccess() {
    setOpen(false);
    addToast(`Role Added `, { appearance: 'success' });
    setRerender((prev: any) => !prev);
  }

  function onSubmit(data: any) {
    const body = {
      name: data.name,
      url: data.url,
      email: profile.email,
    };
    createEntity(body, 'organisations', token, onSuccess);
  }

  return (
    <Box
      as={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ minWidth: '556px' }}>
      <Text variant="pB" sx={{ display: 'inline-block', py: 3, px: 4 }}>
        Create workspace
      </Text>
      <Box sx={{ borderTop: '1px solid', borderColor: 'neutral.1' }}>
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
