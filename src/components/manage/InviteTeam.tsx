import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Checkbox, Flex, Input, Label, Text } from 'theme-ui';
import { createEntity, loadEntity } from '../../utils/models';
import { useStoreState } from 'easy-peasy';
import Creatable from 'react-select/creatable';

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

  const [selectedEmails, setSelectedEmails] = React.useState<
    { value: string; label: string }[]
  >([]);
  // const [emailValidity, setEmailValidity] = React.useState<{
  //   [key: string]: boolean;
  // }>({});

  const handleChange = (selectedOption: any) => {
    setSelectedEmails(selectedOption);

    // Check the validity of each email option and update emailValidity
    //   const newEmailValidity: { [key: string]: boolean } = {};

    //   selectedOption.forEach((emailOption: any) => {
    //     const isValid = emailRegex.test(emailOption.value);
    //     newEmailValidity[emailOption.value] = isValid;
    //   });

    //   setEmailValidity(newEmailValidity);
  };

  React.useEffect(() => {
    // console.log('value', selectedEmails.values);
    for (const email of selectedEmails) {
      console.log('value:', email.value);
    }
    const invalidEmails = selectedEmails.filter(
      (emailOption) => !emailRegex.test(emailOption.value),
    );

    if (invalidEmails.length > 0) {
      for (const email of invalidEmails) {
        if (emailErrorRef.current)
          emailErrorRef.current.textContent = `Invalid email addresses: ${email.value}`;
      }
    } else if (emailErrorRef.current) emailErrorRef.current.textContent = '';

    console.info('invalid', invalidEmails);
  }, [handleChange]);

  function onSubmit(data: any) {
    console.log('submitted', data);
    for (const email of selectedEmails) {
      for (const checkedValue of checkedValues) {
        const data = {
          email: email.value,
          role_id: checkedValue,
        };
        createEntity(data, 'organisations/users/invite', token, onSuccess);
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
            <Creatable
              isMulti
              placeholder="Enter the users email"
              options={[]}
              onChange={handleChange}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  borderColor: state.isFocused ? 'grey' : 'neutral.1',
                }),
              }}
            />
            <Text ref={emailErrorRef} variant="error">
              {errors.email?.message}
            </Text>
          </Box>
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
                    {...register('role', { required: true })}
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
        <Button
          disabled={true && !isValid}
          type="submit"
          variant="buttonPrimarySmall">
          Invite people
        </Button>
      </Box>
    </Flex>
  );
};

export default InviteTeam;
