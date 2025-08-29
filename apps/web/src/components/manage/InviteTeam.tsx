import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { Button, Box, Flex, InputText, Label, Text, Drawer } from '@wraft/ui';
import { XIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import styled from '@xstyled/emotion';

import Checkbox from 'common/Checkbox';
import { IconFrame } from 'common/Atoms';
import { fetchAPI, postAPI } from 'utils/models';
import { emailRegex } from 'utils/regex';

const ReactMultiEmailWrapper = styled(ReactMultiEmail)`
  input {
    background-color: transparent;
    color: var(--theme-ui-colors-text-primary) !important;
  }
  span[data-placeholder] {
    color: var(--theme-ui-colors-text-secondary) !important;
  }
`;

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

      toast.success('Invitations sent successfully', {
        position: 'top-right',
      });
      if (onInviteSuccess) {
        onInviteSuccess();
      }

      setOpen(false);
    } catch (error) {
      toast.error('Failed to send invitations', {
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
          <IconFrame color="icon">
            <XIcon size={18} cursor="pointer" onClick={() => setOpen(false)} />
          </IconFrame>
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
                border="1px solid"
                borderColor="border"
                borderRadius="md"
                bg="transparent">
                <ReactMultiEmailWrapper
                  {...field}
                  emails={selectedEmails}
                  onChange={handleChange}
                  placeholder="Enter all users email"
                  style={{
                    fontSize: '14px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    borderRadius: 'sm',
                    color: 'text-primary',
                  }}
                  getLabel={(email, index, removeEmail) => (
                    <Flex
                      key={index}
                      align="center"
                      border="1px solid"
                      borderColor="border"
                      borderRadius="md"
                      mr="sm"
                      px="sm"
                      py="xs">
                      <Text fontSize="sm" mr="xs">
                        {email}
                      </Text>
                      <IconFrame color="icon">
                        <XIcon
                          size={14}
                          weight="bold"
                          cursor="pointer"
                          onClick={() => removeEmail(index)}
                        />
                      </IconFrame>
                    </Flex>
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
              <IconFrame color="icon">
                <MagnifyingGlassIcon height={18} width={18} />
              </IconFrame>
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
              <Label key={index}>
                <Box
                  display="flex"
                  alignItems="center"
                  key={index}
                  flexShrink="0"
                  px="sm"
                  w="100%"
                  cursor="pointer"
                  borderBottom={
                    index !== filteredRoles.length - 1 ? '1px solid' : 'none'
                  }
                  borderColor="border">
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
