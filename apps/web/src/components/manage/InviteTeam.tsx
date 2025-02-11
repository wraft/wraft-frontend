import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Creatable from 'react-select/creatable';
import { Box, Button, Flex, Input, Label, Text, useThemeUI } from 'theme-ui';

import Checkbox from 'common/Checkbox';
import { fetchAPI, postAPI } from 'utils/models';
import { emailRegex } from 'utils/regex';

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
    trigger,
  } = useForm<FormInputs>({ mode: 'all' });

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
      setCheckedValues([...checkedValues, value]);
    } else {
      setCheckedValues(checkedValues.filter((item: any) => item !== value));
    }
    trigger();
  };

  const handleChange = (selectedOptions: any) => {
    setSelectedEmails(selectedOptions);
    const failedEmails = selectedOptions.filter(
      (emailOption: any) => !emailRegex.test(emailOption.value),
    );
    setInvalidEmails(failedEmails);

    if (failedEmails.length > 0) {
      for (const email of failedEmails) {
        if (emailErrorRef.current)
          emailErrorRef.current.textContent = `Invalid email addresses: ${email.value}`;
      }
    } else if (emailErrorRef.current) emailErrorRef.current.textContent = '';
    trigger();
  };

  useEffect(() => {
    loadRole();
  }, []);

  function onSubmit() {
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
        bg: 'background-primary',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        MaxHeight: '100vh',
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
                        theme.colors && (theme.colors.border as string),
                      fontSize: theme.fontSizes ? theme.fontSizes[2] : '14px',
                      borderRadius: '6px',
                    }),
                    placeholder: (baseStyles) => ({
                      ...baseStyles,
                      fontSize: 12,
                      color:
                        theme.colors &&
                        theme.colors.gray &&
                        theme?.colors?.gray[200],
                    }),
                    multiValue: (baseStyles) => ({
                      ...baseStyles,
                      border: '1px solid',
                      borderColor:
                        theme.colors && (theme.colors.border as string),
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
              sx={{ bg: 'background-primary' }}
            />
          </Box>
          <Flex
            sx={{
              flexDirection: 'column',
              mt: '18px',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 4,
              height: '100%',
              overflowY: 'auto',
              maxHeight: '400px',
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
                    sx={{
                      ml: 2,
                      textTransform: 'capitalize',
                      color: 'text-primary',
                    }}>
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
