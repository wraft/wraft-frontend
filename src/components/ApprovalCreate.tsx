import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Input,
  Label,
  Flex,
  Select,
} from 'theme-ui';
import { useStoreState } from 'easy-peasy';
import { useForm } from 'react-hook-form';

import Field from './Field';
// import styled from 'styled-components';
import { createEntity, loadEntity } from '../utils/models';
import { defaultModalStyle } from '../utils';

import Modal from 'react-modal';

interface ApprovalFormBaseProps {
  states?: Array<any>;
  isOpen?: boolean;
  closeModal?: any;
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

const ApprovalFormBase = ({ states, isOpen, closeModal }: ApprovalFormBaseProps) => {
  const { register, handleSubmit, setValue } = useForm();
  const token = useStoreState((state) => state.auth.token);
  const [users, setUsers] = useState<any>();
  const [user, setUser] = useState<any>();
  const [showSearch, setShowSearch] = useState<boolean>(false);

  /**
   * Submit Form
   * @param data Form Data
   */
  const onSubmit = (data: any) => {
    createEntity(data, 'flows', token);
  };

  const loadSearchSuccess = (d: any) => {
    const usr = d.users;
    setUsers(usr);
  };

  const onUserSelect = (e: User) => {
    setUser(e);
    setValue('user_id', e.id);
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
    loadEntity(
      token,
      `users/search?key=${e.currentTarget.value}`,
      loadSearchSuccess,
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      style={defaultModalStyle}
      ariaHideApp={false}
      contentLabel="FileUploader">
      <Box mx={0} mb={3} sx={{ p: 4, mt: 0 }} as="form" onSubmit={handleSubmit(onSubmit)}>
        <Field
          name="name"
          label="Name"
          defaultValue="Standard Approval Flow (Offer Letter)"
          register={register}
        />
        <Flex mt={0}>
          <Box sx={{ width: '50%', p: 2, my: 4 }}>
            <Label>After</Label>
            <Select
              id="pre_state_id"
              name="pre_state_id"
              defaultValue=""
              ref={register({ required: true })}>
              {states &&
                states.map((s: any) => (
                  <option value={s.state.id}>{s.state.state}</option>
                ))}
            </Select>
          </Box>

          <Box sx={{ width: '50%', p: 2, my: 4 }}>
            <Label>After</Label>
            <Select
              id="post_state_id"
              name="post_state_id"
              defaultValue=""
              ref={register({ required: true })}>
              {states &&
                states.map((s: any) => (
                  <option value={s.state.id}>{s.state.state}</option>
                ))}
            </Select>
          </Box>
        </Flex>
        <Box sx={{ p: 2 }}>
          <Label>Search</Label>
          <Input
            name="approver_id"
            onChange={onChangeInput}
            ref={register({ required: true })}
          />
          {users &&
            users.map((x: any) => (
              <Box
                sx={{
                  bg: 'gray.0',
                  p: 2,
                  px: 3,
                  border: 'solid 1px',
                  borderColor: 'gray.3',
                }}
                onClick={() => onUserSelect(x)}>
                <Text as="h4" color="gray.9">
                  {x.name}
                </Text>
                <Text as="em" color="gray.6">
                  {x.email}
                </Text>
              </Box>
            ))}
        </Box>

        <Button type="submit" mt={3}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default ApprovalFormBase;