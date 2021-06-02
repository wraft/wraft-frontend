import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Avatar } from 'theme-ui';
import { loadEntity } from '../utils/models';
import { useStoreState } from 'easy-peasy';
import { TimeAgo } from './ContentDetail';
// import { Button } from 'theme-ui';

// import { useToasts } from 'react-toast-notifications';

export interface AcitivityFeeds {
    total_pages:   number;
    total_entries: number;
    page_number:   number;
    activities:    Activity[];
}

export interface Activity {
    object_details: ObjectDetails;
    object:         string;
    meta:           Meta;
    inserted_at:    Date;
    actor:          string;
    action:         string;
}

export interface Meta {
    to?:   To;
    from?: string;
}

export interface To {
    name: string;
}

export interface ObjectDetails {
    name: string;
    id?:  string;
}


/**
 *
 * @returns
 */

 const ActivityCard = (props: any) => (
    <Flex sx={{ borderBottom: 'solid 1px', borderColor: 'gray.3', mb: 2 }}>
      <Box as="span">
        <Avatar
          width="32px"
          sx={{ mr: 2 }}
          src="https://wraft.x.aurut.com//uploads/avatars/1/profilepic_Richard%20Hendricks.jpg?v=63783661237"
        />
      </Box>
      <Box pt={1}>
        <Text sx={{ fontSize: 0, display: 'inline-block', fontWeight: 600 }}>
          {props?.actor}
        </Text>{' '}
        <Text as="em" sx={{ fontSize: 0, display: 'inline-block', mr: 2 }}>{props?.action}d </Text>
        <Text sx={{ fontSize: 0, display: 'inline-block', fontWeight: 600 }}>
          {props?.object_details?.name}
        </Text>
      </Box>
      <Box sx={{ ml: 'auto'}}>
        <TimeAgo time={props?.inserted_at} sx={{ mr: 2 }} />
      </Box>
    </Flex>
  );

const ActivityFeed = () => {
  const token = useStoreState(state => state.auth.token);
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
      <Text mb={3}>
        Acitivity Feeds
      </Text>
      <Box mx={0} mb={3}>

        { !contents &&
          <Text>Nothing to approve</Text>
        }
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
