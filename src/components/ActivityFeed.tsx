import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Avatar } from 'theme-ui';
import { loadEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';
import { TimeAgo } from './Atoms';
// import { Button } from 'theme-ui';

import { API_HOST } from '../utils/models';

export interface ActivityStream {
  activities: Activity[];
  page_number: number;
  total_entries: number;
  total_pages: number;
}

export interface Activity {
  action: Action;
  actor: Actor;
  actor_profile: ActorProfile;
  inserted_at: Date;
  meta: any;
  object: string;
}

export enum Action {
  Insert = 'insert',
  Update = 'update',
}

export interface Actor {
  email: Email;
  email_verify: boolean;
  id: string;
  inserted_at: Date;
  name: Name;
  updated_at: Date;
}

export enum Email {
  AdminWraftdocsCOM = 'shijith.k@aurut.com',
}

export enum Name {
  MuneefHameed = 'Muneef Hameed',
}

export interface ActorProfile {
  dob: Date;
  gender: Gender;
  id: string;
  name: Name;
  profile_pic: string;
}

export enum Gender {
  Male = 'Male',
}

// export interface Meta {}

/**
 *
 * @returns
 */

const ActivityCard = (props: any) => (
  <Flex sx={{ borderBottom: 'solid 1px', borderColor: 'gray.3', mb: 2, p: 2 }}>
    <Box as="span">
      <Avatar
        width="32px"
        sx={{ mr: 2 }}
        src={`${API_HOST}/${props?.actor_profile?.profile_pic}`}
      />
    </Box>
    <Box pt={1}>
      <Text sx={{ fontSize: 0, display: 'inline-block', fontWeight: 600 }}>
        {props?.actor?.name}
      </Text>{' '}
      <Text as="em" sx={{ fontSize: 0, display: 'inline-block', mr: 2 }}>
        {props?.action}d{' '}
      </Text>
      {/* <Text sx={{ fontSize: 0, display: 'inline-block', fontWeight: 600 }}>
        {props?.object_details?.name}
      </Text> */}
    </Box>
    <Box sx={{ ml: 'auto' }}>
      <TimeAgo time={props?.inserted_at} />
    </Box>
  </Flex>
);

const ActivityFeed = () => {
  const token = useStoreState((state) => state.auth.token);
  const [contents, setContents] = useState<Array<Activity>>([]);
  // const { addToast } = useToasts();

  const loadDataSuccess = (data: any) => {
    const res: Activity[] = data.activities;
    setContents(res);
  };

  const loadData = (t: string) => {
    loadEntity(t, 'activities', loadDataSuccess);
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  return (
    <Box py={3} mt={4}>
      <Box mx={0} mb={3}>
        {!contents && <Text>No activities yet</Text>}
        <Box>
          {contents &&
            contents.length > 0 &&
            contents.map((m: any) => <ActivityCard key={m.id} {...m} />)}
        </Box>
      </Box>
    </Box>
  );
};
export default ActivityFeed;
