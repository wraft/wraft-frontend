import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useStoreState } from 'easy-peasy';

import { Button, Alert, Close, Spinner, Box, Text } from 'theme-ui';
// import { Label, Select, Textarea } from '@rebass/forms';

import Field from './Field';
import { checkUser, createEntity, loadEntity } from '../utils/models';

export interface Profile {
  allergies?: string[];
  profile: ProfileClass;
  risks?: string[];
}

export interface ProfileClass {
  activity_level_id: string;
  calory_range_id: string;
  dob: string;
  gender: string;
  goal_id: string;
  height: number;
  menu_id: string;
  mobile_number: string;
  profile_id: string;
  weight: number;
}

const OrgMemberForm = () => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const token = useStoreState(state => state.auth.token);
  const [ready, setReady] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>();
  const [organ, setOrgan] = useState<any>();

  const onCreate = (d: any) => {
    setSuccess(true);
    console.log('__d', d);
    // if (d && d.id) {
    //   // Router.push(`/user-profile`);
    // }
  };

  /** Send Invite Form */

  const onInviteSubmit = (data: any) => {
    console.log('data', data);
    createEntity(data, `organisations/${organ?.id}/invite`, token, onCreate);
  }

  /** Update Form */

  
  // const onSubmit = (data: any) => {
  //   console.log('data', data);
  //   createEntity(data, 'organisations', token, onCreate);
  //   // updateEntity('organisations', data, token, onCreate);
  // };

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  const onProfileLoad = (data: any) => {
    const res: any[] = data;
    setProfile(res);
  };

  useEffect(() => {
    // check if token is there
    // const tokenInline = cookie.get('token') || false;
    //
    if (token) {
      checkUser(token, onProfileLoad);
      // loadEntity(token, 'macros', loadDataSuccess);
    }
  }, [token]);

  /**
   * When Org data is load
   *
   */
  const onOrgLoad = (_o: any) => {
    setReady(true);
    console.log('profile.organisation_id', _o);
    setOrgan(_o);

    Object.keys(_o).map(function(key, index) {
      console.log('key', key, index, `${key}`, _o[`${key}`]);
      setValue(`${key}`, _o[`${key}`]);
    });

    // set sample
  };

  const onOrgMembLoad = (_o: any) => {
    setReady(true);
    console.log('onOrgMembLoad', _o);
    // setOrgan(_o);

    // Object.keys(_o).map(function(key, index) {
    //   console.log('key', key, index, `${key}`, _o[`${key}`]);
    //   setValue(`${key}`, _o[`${key}`]);
    // });
  };

  /**
   * Set Profile Context
   */

  useEffect(() => {
    // check if token is there
    // const tokenInline = cookie.get('token') || false;
    //
    if (profile) {
      console.log('profile', profile);
      // setValue('')
      // checkUser(token, onProfileLoad);
      loadEntity(token, `organisations/${profile.organisation_id}`, onOrgLoad);
      loadEntity(
        token,
        `organisations/${profile.organisation_id}/memberships`,
        onOrgMembLoad,
      );
    }

    // if(organ) {
    //   console.log('got organ', organ);
    // }
  }, [profile]);

  /**
   * Watch Form Change
   */
  // const checkChange = (_a: any) => {
  //   console.log('__args', _a);
  // };

  return (
    <Box py={3} px={6} variant="w70" mt={4}>
      {!ready && <Spinner />}
      {success && (
        <Alert>
          Category created succesfully!
          <Close ml="auto" mr={-2} />
        </Alert>
      )}

      <Box>
        <Box>
          <Text variant="pagetitle">Invite Members</Text>
          <Box
            mx={0}
            mb={3}
            variant="w100"
            as="form"
            onSubmit={handleSubmit(onInviteSubmit)}>
            <Field
              name="organisation_id"
              label="Org ID"
              defaultValue={organ?.id}
              register={register}
            />
            
            {/* <Field
              name="name"
              label="Name"
              defaultValue="Anand Ash"
              register={register}
            /> */}
            <Field
              name="email"
              label="Email Address"
              defaultValue="anand@aurut.com"
              register={register}
            />
            <Button type="submit" ml={2} mt={3}>
              Update Profile
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default OrgMemberForm;
