import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import Checkbox from '@wraft-ui/Checkbox';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Creatable from 'react-select/creatable';
import { Box, Button, Flex, Input, Label, Text, useThemeUI } from 'theme-ui';

import { fetchAPI, postAPI } from '../../utils/models';
import { emailRegex } from '../../utils/regex';

interface FormInputs {
  emails: string[];
  role: string;
}

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const InviteTeam = ({ setOpen }: Props) => {
  const [roles, setRoles] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [checkedValues, setCheckedValues] = useState<any>([]);
  const [invalidEmails, setInvalidEmails] = useState<any>([]);
  const [selectedEmails, setSelectedEmails] = useState<
    { value: string; label: string }[]
  >([]);

  const emailErrorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
  } = useForm<FormInputs>({ mode: 'onChange' });

  const { theme } = useThemeUI();

  const loadRole = () => {
    fetchAPI('roles').then((data: any) => {
      setRoles(data);
    });
  };

  const filteredRoles = roles.filter((role: any) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  const handleChange = (selectedOption: any) => {
    setSelectedEmails(selectedOption);
    console.log('all emailsc:', selectedEmails);
    for (const email of selectedEmails) {
      console.log('value:', email.value);
    }
    const invalidEmails = selectedEmails.filter(
      (emailOption) => !emailRegex.test(emailOption.value),
    );
    setInvalidEmails(invalidEmails);

    if (invalidEmails.length > 0) {
      for (const email of invalidEmails) {
        if (emailErrorRef.current)
          emailErrorRef.current.textContent = `Invalid email addresses: ${email.value}`;
      }
    } else if (emailErrorRef.current) emailErrorRef.current.textContent = '';

    console.info('invalid', invalidEmails);
  };

  useEffect(() => {
    loadRole();
  }, []);

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
            <Controller
              name="emails"
              control={control}
              rules={{
                validate: () =>
                  selectedEmails.length > 0 && invalidEmails.length < 1,
              }}
              render={({ field }) => (
                <Creatable
                  {...field}
                  isMulti
                  placeholder="Enter all users email"
                  options={[]}
                  onChange={handleChange}
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
                        theme.colors.neutral[200],
                      fontSize: theme.fontSizes ? theme.fontSizes[2] : '14px',
                      borderRadius: '6px',
                    }),
                    placeholder: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: 12,
                      color:
                        theme.colors &&
                        theme.colors.gray &&
                        theme?.colors?.gray[2],
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
              )}
            />
            <Text ref={emailErrorRef} variant="error">
              {errors.emails?.message}
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
                    {...register('role', {
                      validate: () => checkedValues.length > 0,
                    })}
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
        <Button disabled={!isValid} type="submit" variant="buttonPrimarySmall">
          Invite people
        </Button>
      </Box>
    </Flex>
  );
};

export default InviteTeam;
