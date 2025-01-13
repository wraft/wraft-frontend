import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Close, Spinner } from 'theme-ui';
import { Button, Box, Text } from '@wraft/ui';

import Modal from 'common/Modal';
import Field from 'common/Field';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, postAPI } from 'utils/models';

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
  const { register, handleSubmit, setValue } = useForm();
  const [ready, setReady] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [members, setMembers] = useState<Member | undefined>();
  const [organ, setOrgan] = useState<any>();
  const [showSearch, setShowSearch] = useState<boolean>(false);

  const { userProfile } = useAuth();

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const onCreate = (_data: any) => {
    setSuccess(true);
  };

  const onInviteSubmit = (data: any) => {
    postAPI(`organisations/${organ?.id}/invite`, data).then((response: any) => {
      onCreate(response);
    });
  };

  /**
   * When Org data is load
   *
   */
  const onOrgLoad = (_o: any) => {
    setReady(true);
    setOrgan(_o);

    Object.keys(_o).map(function (key, _index) {
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
                  <Text>Invite Members</Text>
                  <Box as="form" onSubmit={handleSubmit(onInviteSubmit)}>
                    <Box>
                      <Field
                        name="organisation_id"
                        label="Org ID"
                        defaultValue={organ?.id}
                        register={register}
                      />
                      <Text
                      // sx={{
                      //   fontSize: 'xs',
                      //   // pl: 3,
                      //   py: 2,
                      //   color: 'text-primary',
                      //   textTransform: 'uppercase',
                      // }}
                      >
                        {organ?.name}
                      </Text>
                    </Box>
                    <Field
                      name="email"
                      label="Email Address"
                      defaultValue="anand@aurut.com"
                      register={register}
                    />
                    <Button variant="secondary" type="submit">
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
