import React from 'react';

import Checkbox from '@wraft-ui/Checkbox';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Creatable from 'react-select/creatable';
import { Box, Button, Flex, Input, Label, Text, useThemeUI } from 'theme-ui';

import { fetchAPI, postAPI } from '../../utils/models';
import { emailRegex } from '../../utils/regex';

interface FormInputs {
  email: string;
  role: string;
}

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InviteTeam = ({ setOpen }: Props) => {
  const { theme } = useThemeUI();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormInputs>({ mode: 'all' });

  const [roles, setRoles] = React.useState<any>([]);

  const loadRole = () => {
    fetchAPI('roles').then((data: any) => {
      setRoles(data);
    });
  };

  React.useEffect(() => {
    loadRole();
  }, []);

  const emailErrorRef = React.useRef<HTMLDivElement>(null);

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

  const handleChange = (selectedOption: any) => {
    setSelectedEmails(selectedOption);
  };

  React.useEffect(() => {
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
      const data = {
        email: email.value,
        role_ids: checkedValues,
      };
      postAPI('organisations/users/invite', data).then(() => {
        toast.success('Invited', {
          duration: 1000,
          position: 'top-right',
        });
        setOpen(false);
      });
    }
  }

  return (
    <Flex
      as={'form'}
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        bg: 'backgroundWhite',
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
            borderColor: 'border',
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
              // filterOption={() => false}
              components={{
                Menu: () => null,
                ClearIndicator: () => null,
                DropdownIndicator: () => null,
              }}
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  backgroundColor:
                    theme.colors && (theme.colors.bgWhite as string),
                  borderColor:
                    theme.colors &&
                    theme.colors.neutral &&
                    theme.colors.neutral[1],
                  fontSize: theme.fontSizes ? theme.fontSizes[2] : '14px',
                  borderRadius: '6px',
                }),
                placeholder: (baseStyles) => ({
                  ...baseStyles,
                  fontSize: 12,
                  color:
                    theme.colors && theme.colors.gray && theme?.colors?.gray[2],
                }),
                multiValue: (baseStyles) => ({
                  ...baseStyles,
                  border: '1px solid',
                  borderColor:
                    theme.colors &&
                    theme.colors.neutral &&
                    theme.colors.neutral[1],
                  backgroundColor:
                    theme.colors && (theme.colors.background as string),
                  padding: '0px 4px 0px 14px',
                  borderRadius: '16px',
                }),
                multiValueRemove: (styles) => ({
                  ...styles,
                  color: 'gray',
                  ':hover': {
                    color: 'red',
                  },
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
              sx={{ bg: 'background' }}
            />
          </Box>
          <Flex
            sx={{
              flexDirection: 'column',
              mt: '18px',
              border: '1px solid',
              borderColor: 'border',
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
                    borderColor: 'border',
                    py: '12px',
                    px: '16px',
                    ':last-of-type': {
                      borderBottom: 'none',
                    },
                  }}>
                  <Checkbox
                    size={'small'}
                    {...register('role', { required: true })}
                    value={role.id}
                    onChange={(e: any) => {
                      handleCheckboxChange(e);
                    }}
                  />
                  <Text
                    variant="pR"
                    sx={{ ml: 2, textTransform: 'capitalize', color: 'text' }}>
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
