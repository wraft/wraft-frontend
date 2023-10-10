import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Checkbox, Flex, Label, Text } from 'theme-ui';
import Field from '../Field';
import { loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';

interface FormInputs {
  name: string;
  slug: string;
  height: number;
  width: number;
  description: string;
  engine_uuid: string;
  screenshot: any;
  unit: string;
}

const InviteTeam = () => {
  const token = useStoreState((state) => state.auth.token);
  const {
    // watch,
    register,
    // control,
    // handleSubmit,
    // formState: { errors, isValid },
    // setValue,
  } = useForm<FormInputs>({ mode: 'all' });

  const [roles, setRoles] = React.useState<any>([]);

  const loadRoleSuccess = (data: any) => {
    console.log(data);
    setRoles(data);
  };

  const loadRole = (token: string) => {
    loadEntity(token, 'roles', loadRoleSuccess);
  };

  React.useEffect(() => {
    loadRole(token);
  }, []);

  return (
    <Box>
      <Box
        sx={{
          px: 4,
          py: 3,
          borderBottom: '1px solid',
          borderColor: 'gray.0',
        }}>
        <Text variant="pB">Invite people</Text>
      </Box>
      <Box sx={{ px: 4 }}>
        <Box sx={{ py: '24px' }}>
          <Field
            name="email"
            register={register}
            placeholder="Enter the users email separated by commas"
          />
        </Box>
        <Field
          label="Choose role"
          name="search"
          register={register}
          placeholder="Search by"
        />
        <Flex
          sx={{
            flexDirection: 'column',
            mt: '18px',
            border: '1px solid',
            borderColor: 'neutral.1',
            borderRadius: 4,
          }}>
          {roles.map((role: any) => {
            return (
              <Label
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'neutral.1',
                  py: '12px',
                  px: '16px',
                }}>
                <Checkbox sx={{ width: '16px', height: '16px' }} />
                <Text
                  variant="pR"
                  sx={{ textTransform: 'capitalize', color: 'green.5' }}>
                  {role.name}
                </Text>
              </Label>
            );
          })}
        </Flex>
      </Box>
    </Box>
  );
};

export default InviteTeam;
