import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { useThemeUI } from 'theme-ui';
import { Button, Box, Flex, InputText, Label, Text, Drawer } from '@wraft/ui';
import { SearchIcon } from '@wraft/icon';
import { X } from '@phosphor-icons/react';

import Checkbox from 'common/Checkbox';
import { fetchAPI, postAPI } from 'utils/models';
import { emailRegex } from 'utils/regex';

interface FormInputs {
  emails: string[];
  role: string;
}

interface Props {
  setOpen: Dispatch<SetStateAction<boolean>>;
  onInviteSuccess?: () => void;
}

const InviteTeam = ({ setOpen, onInviteSuccess }: Props) => {
  const [roles, setRoles] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [checkedValues, setCheckedValues] = useState<any>([]);
  const [invalidEmails, setInvalidEmails] = useState<any>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleChange = (emails: string[]) => {
    setSelectedEmails(emails);
    const failedEmails = emails.filter(
      (email: string) => !emailRegex.test(email),
    );
    setInvalidEmails(failedEmails);

    if (failedEmails.length > 0) {
      if (emailErrorRef.current) {
        emailErrorRef.current.textContent = `Invalid email addresses: ${failedEmails.join(', ')}`;
      }
    } else if (emailErrorRef.current) {
      emailErrorRef.current.textContent = '';
    }
    trigger();
  };

  useEffect(() => {
    loadRole();
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      const invitePromises = selectedEmails.map((email) => {
        const data = {
          email: email,
          role_ids: checkedValues,
        };
        return postAPI('organisations/users/invite', data);
      });

      await Promise.all(invitePromises);

      toast.success('All invitations sent successfully', {
        duration: 2000,
        position: 'top-right',
      });
      if (onInviteSuccess) {
        onInviteSuccess();
      }

      setOpen(false);
    } catch (error) {
      toast.error('Failed to send invitations', {
        duration: 2000,
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex
      as="form"
      h="100vh"
      direction="column"
      onSubmit={handleSubmit(onSubmit)}>
      <Box flexShrink="0" borderBottom="1px solid " borderColor="border">
        <Drawer.Header>
          <Drawer.Title>Invite people</Drawer.Title>
          <X
            size={20}
            weight="bold"
            cursor="pointer"
            onClick={() => setOpen(false)}
          />
        </Drawer.Header>
      </Box>

      <Box flex={1} overflowY="auto" px="xl">
        <Box py="lg">
          <Label htmlFor="emails">Email address</Label>
          <Controller
            name="emails"
            control={control}
            rules={{
              validate: () =>
                selectedEmails.length > 0 && invalidEmails.length < 1,
            }}
            render={({ field }) => (
              <Box
                style={{
                  border: '1px solid',
                  borderColor: theme.colors && (theme.colors.border as string),
                  borderRadius: '4px',
                  backgroundColor:
                    theme.colors && (theme.colors.bgWhite as string),
                  minHeight: '40px',
                  padding: '0px 4px 0px 4px',
                }}>
                <ReactMultiEmail
                  {...field}
                  emails={selectedEmails}
                  onChange={handleChange}
                  placeholder="Enter all users email"
                  style={{
                    fontSize: '14px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                  }}
                  getLabel={(email, index, removeEmail) => (
                    <Box
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        margin: '2px',
                        padding: '2px 8px',
                        backgroundColor:
                          theme.colors && (theme.colors.background as string),
                        border: '1px solid',
                        borderColor:
                          theme.colors && (theme.colors.border as string),
                        borderRadius: '16px',
                        fontSize: '14px',
                      }}>
                      <Text fontSize="sm" mr="xs">
                        {email}
                      </Text>
                      <X
                        size={14}
                        weight="bold"
                        cursor="pointer"
                        onClick={() => removeEmail(index)}
                        style={{
                          color: 'gray',
                          marginLeft: '4px',
                        }}
                      />
                    </Box>
                  )}
                />
              </Box>
            )}
          />
          <Text ref={emailErrorRef} color="error" fontSize="sm" mt="2">
            {errors.emails?.message}
          </Text>
        </Box>

        <Box>
          <Label htmlFor="search">Choose roles</Label>
          <InputText
            type="search"
            placeholder="Search roles"
            onChange={(e: any) => setSearchTerm(e.target.value)}
            px="xxl"
            icon={
              <SearchIcon
                height={18}
                width={18}
                color={theme.colors?.gray?.[900]}
              />
            }
          />
        </Box>

        <Flex
          direction="column"
          mt="lg"
          border="1px solid"
          borderColor="border"
          borderRadius="sm"
          maxHeight="361px"
          overflowY="auto">
          {filteredRoles.map((role: any, index: number) => {
            return (
              <Label
                key={index}
                style={{
                  borderBottom:
                    index !== filteredRoles.length - 1
                      ? '1px solid #e2e8f0'
                      : 'none',
                }}>
                <Box display="flex" alignItems="center" flexShrink="0" mx="sm">
                  <Checkbox
                    size="small"
                    {...register('role', {
                      validate: () => checkedValues.length > 0,
                    })}
                    value={role.id}
                    onChange={(e: any) => {
                      handleCheckboxChange(e);
                    }}
                  />
                  <Text py="md" mx="xs" textTransform="capitalize">
                    {role.name}
                  </Text>
                </Box>
              </Label>
            );
          })}
        </Flex>

        {errors.role && (
          <Text color="error" fontSize="sm" mt="2">
            Please select at least one role
          </Text>
        )}
      </Box>

      <Flex flexShrink="0" px="xl" py="md" gap="sm">
        <Button
          disabled={!isValid || isLoading}
          loading={isLoading}
          type="submit">
          Invite people
        </Button>
      </Flex>
    </Flex>
  );
};

export default InviteTeam;
