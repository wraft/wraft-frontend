import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { Button, Alert, Close, Spinner, Box, Text } from 'theme-ui';

import { useAuth } from '../contexts/AuthContext';
import { fetchAPI, postAPI } from '../utils/models';

import Field from './Field';
import Modal from './Modal';
import OrgMembersList from './OrgMembersList';

export interface Members {
  total_pages: number;
  total_entries: number;
  page_number: number;
  members: Member[];
}

export interface Member {
  updated_at: Date;
  role: string;
  profile_pic: string;
  organisation_id: string;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
}

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [ready, setReady] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [members, setMembers] = useState<Member | undefined>();
  const [organ, setOrgan] = useState<any>();
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const { userProfile } = useAuth();

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

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
    postAPI(`organisations/${organ?.id}/invite`, data).then((data: any) => {
      onCreate(data);
    });
  };

  /** Update Form */

  // const onSubmit = (data: any) => {
  //   console.log('data', data);
  //   createEntity(data, 'organisations', token, onCreate);
  //   // updateEntity('organisations', data, token, onCreate);
  // };

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  /**
   * When Org data is load
   *
   */
  const onOrgLoad = (_o: any) => {
    setReady(true);
    console.log('profile.organisation_id', _o);
    setOrgan(_o);

    Object.keys(_o).map(function (key, index) {
      console.log('key', key, index, `${key}`, _o[`${key}`]);
      setValue(`${key}`, _o[`${key}`]);
    });
  };

  const loadDataSuccess = (data: any) => {
    const res: any = data.members;
    setMembers(res);
  };

  const onInvite = () => {
    setShowSearch(true);
  };

  /**
   * Set Profile Context
   */

  useEffect(() => {
    if (userProfile) {
      fetchAPI(`organisations/${userProfile?.organisation_id}`).then(
        (data: any) => {
          onOrgLoad(data);
        },
      );

      fetchAPI(`organisations/${userProfile?.organisation_id}/members`).then(
        (data: any) => {
          loadDataSuccess(data);
        },
      );
    }
  }, []);

  return (
    <Box px={0} variant="w70" mt={4}>
      {!ready && <Spinner />}
      {success && (
        <Alert>
          Category created succesfully!
          <Close ml="auto" mr={-2} />
        </Alert>
      )}

      <Box>
        {organ && (
          <Box>
            <Box onClick={toggleSearch}></Box>
            <OrgMembersList
              id={organ?.id}
              members={members}
              onInitInvite={onInvite}
            />
            <Box>
              <Modal
                isOpen={showSearch}
                // onRequestClose={closeSearch}
                // // style={defaultModalStyle}
                // ariaHideApp={false}
                // contentLabel="SearchWraft"
              >
                <Box p={4}>
                  <Text variant="blockTitle">Invite Members</Text>
                  <Box as="form" onSubmit={handleSubmit(onInviteSubmit)}>
                    <Box sx={{ display: 'none' }}>
                      <Field
                        name="organisation_id"
                        label="Org ID"
                        defaultValue={organ?.id}
                        register={register}
                      />
                      <Text
                        variant="blocktitle"
                        sx={{
                          fontSize: 1,
                          // pl: 3,
                          py: 2,
                          color: 'primary',
                          textTransform: 'uppercase',
                        }}>
                        {organ?.name}
                      </Text>
                    </Box>
                    <Field
                      name="email"
                      label="Email Address"
                      defaultValue="anand@aurut.com"
                      register={register}
                    />
                    <Button variant="secondary" type="submit" ml={0} mt={3}>
                      Invite
                    </Button>
                  </Box>
                </Box>
              </Modal>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
export default OrgMemberForm;
