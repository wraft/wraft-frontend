import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Checkbox, Flex, Input, Label, Text } from 'theme-ui';
// import Field from '../Field';
import { createEntity, loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';

interface FormInputs {
  email: string;
  role: string;
}

const InviteTeam = () => {
  const token = useStoreState((state) => state.auth.token);
  const {
    // watch,
    register,
    // control,
    handleSubmit,
    formState: { errors, isValid },
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

  const emailErrorRef = React.useRef<HTMLDivElement>(null);
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  const [emailAddresses, setEmailAddresses] = React.useState([]);
  const checkEmail = (e: any) => {
    const email = e.target.value;
    const emails = email.replace(/\s+/g, '').split(',');
    setEmailAddresses(emails);
    for (let i = 0; i < emails.length; i++) {
      if (!emailRegex.test(emails[i])) {
        // Handle invalid email address
        console.error(`Invalid email address: ${emails[i]}`);
        if (emailErrorRef.current)
          emailErrorRef.current.textContent = `Invalid email address: ${emails[i]}`;
      } else {
        if (emailErrorRef.current) emailErrorRef.current.textContent = ``;
      }
    }
  };

  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const filteredRoles = roles.filter((role: any) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const [checkedValues, setCheckedValues] = React.useState<any>([]);

  const handleCheckboxChange = (event: any) => {
    const checked = event.target.checked;
    const value = event.target.value;

    if (checked) {
      console.log('checked', value);
      setCheckedValues([...checkedValues, value]);
    } else {
      console.log('unchecked', value);
      setCheckedValues(checkedValues.filter((item: any) => item !== value));
    }
  };

  React.useEffect(() => {
    console.log(checkedValues);
  }, [checkedValues]);

  function onSubmit(data: any) {
    console.log('submitted', data);

    const formData = new FormData();

    for (const email of emailAddresses) {
      for (const checkedValue of checkedValues) {
        formData.append('email', email);
        formData.append('role_id', checkedValue);

        createEntity(formData, token, 'organisations/users/invite', onSuccess);
        // Clear formData for the next iteration
        formData.delete('email');
        formData.delete('role_id');
      }
    }
  }

  function onSuccess(data: any) {
    console.log(data);
  }

  return (
    <Flex
      as={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        maxHeight: '100dvh',
        overflow: 'none',
      }}>
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
            {/* <Field
              name="emails"
              register={register}
              placeholder="Enter the users email separated by commas"
              error={errors.email}
            /> */}
            <Input
              type="text"
              placeholder="Enter the users email separated by commas"
              {...register('email', { required: 'Email is required' })}
              onChange={checkEmail}
            />
            <Text ref={emailErrorRef} variant="error">
              {errors.email?.message}
            </Text>
          </Box>
          {/* <Field
            label="Choose role"
            name="search"
            register={register}
            placeholder="Search by"
            onChange={(e: any) => setSearchTerm(e.target.value)}
          /> */}
          <Box>
            <Label htmlFor="search">Choose role</Label>
            <Input
              type="search"
              placeholder="Search by"
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
          </Box>
          <Flex
            sx={{
              flexDirection: 'column',
              mt: '18px',
              border: '1px solid',
              borderColor: 'neutral.1',
              borderRadius: 4,
            }}>
            {filteredRoles.map((role: any, index: number) => {
              return (
                <Label
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'neutral.1',
                    py: '12px',
                    px: '16px',
                    ':last-of-type': {
                      borderBottom: 'none',
                    },
                  }}>
                  <Checkbox
                    sx={{ width: '16px', height: '16px' }}
                    {...register('role')}
                    value={role.id}
                    onChange={(e: any) => {
                      handleCheckboxChange(e);
                    }}
                  />
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
      <Box sx={{ p: 4 }}>
        <Button disabled={!isValid} type="submit" variant="buttonPrimarySmall">
          Invite people
        </Button>
      </Box>
    </Flex>
  );
};

export default InviteTeam;
