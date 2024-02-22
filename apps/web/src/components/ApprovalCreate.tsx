import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, Text, Input, Label, Flex, Select } from 'theme-ui';

import { postAPI, fetchAPI } from '../utils/models';
import Field from './Field';
interface ApprovalFormBaseProps {
  states?: Array<any>;
  // isOpen?: boolean;
  closeModal?: any;
  // dialog?: any;
  parent?: string;
}

export interface FlowEdit {
  page_number: number;
  total_entries: number;
  total_pages: number;
  users: User[];
}

export interface User {
  email: string;
  email_verify: boolean;
  id: string;
  inserted_at: Date;
  name: string;
  updated_at: Date;
}

const ApprovalFormBase = ({
  states,
  // dialog,
  parent,
  closeModal,
}: ApprovalFormBaseProps) => {
  const { register, control, handleSubmit, setValue } = useForm();
  const [users, setUsers] = useState<any>();
  const [user, setUser] = useState<any>();
  const [showSearch, setShowSearch] = useState<boolean>(false);

  /**
   * Submit Form
   * @param data Form Data
   */
  const onSubmit = (data: any) => {
    console.log('submitted');
    postAPI('approval_systems', data);
  };

  const onUserSelect = (e: User) => {
    setUser(e);
    setValue('approver_id', e.id);
    setShowSearch(false);
    console.log('Selected User', e);
  };

  /**
   * Search User
   * @param data
   */

  const onChangeInput = (e: any) => {
    console.log('search', e.currentTarget.value);
    setShowSearch(true);
    fetchAPI(`users/search?key=${e.currentTarget.value}`).then((data: any) => {
      const usr = data.users;
      setUsers(usr);
    });
  };

  return (
    <Box
      mx={0}
      mb={3}
      sx={{ p: 4, mt: 0, minWidth: '600px' }}
      as="form"
      onSubmit={handleSubmit(onSubmit)}>
      {showSearch && <h1>Searching</h1>}
      {user && <h1>User</h1>}
      <Input
        defaultValue={parent}
        {...register('flow_id', { required: true })}
      />
      <Field
        name="name"
        label="Name"
        defaultValue="Standard Approval Flow (Offer Letter)"
        register={register}
      />
      <Flex mt={0}>
        <Box sx={{ width: '50%', p: 2, my: 4 }}>
          <Label>Before</Label>
          <Controller
            control={control}
            name="pre_state_id"
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field}>
                {states &&
                  states.map((s: any) => (
                    <option key={s.state.id} value={s.state.id}>
                      {s.state.state}
                    </option>
                  ))}
              </Select>
            )}
          />
        </Box>

        <Box sx={{ width: '50%', p: 2, my: 4 }}>
          <Label>After</Label>
          <Controller
            control={control}
            name="post_state_id"
            defaultValue=""
            rules={{ required: true }}
            render={({ field }) => (
              <Select {...field}>
                {states &&
                  states.map((s: any) => (
                    <option key={s.state.id} value={s.state.id}>
                      {s.state.state}
                    </option>
                  ))}
              </Select>
            )}
          />
        </Box>
      </Flex>
      <Box sx={{ p: 2 }}>
        <Label>Search</Label>
        <Input
          defaultValue={''}
          {...register('approver_id', { required: true })}
          onChange={onChangeInput}
        />
        {users &&
          users.map((x: any) => (
            <Box
              key={x?.name}
              sx={{
                bg: 'background',
                p: 2,
                px: 3,
                border: 'solid 1px',
                borderColor: 'border',
              }}
              onClick={() => onUserSelect(x)}>
              <Text as="h4" color="text">
                {x.name}
              </Text>
              <Text as="em" color="gray.600">
                {x.email}
              </Text>
            </Box>
          ))}
      </Box>
      <Flex>
        <Button
          type="submit"
          mt={3}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}>
          Save
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            closeModal();
          }}
          variant="btnSecondary"
          type="submit"
          ml={2}
          mt={3}>
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export default ApprovalFormBase;
