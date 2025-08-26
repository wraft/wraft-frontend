import React from 'react';
import { Box, Flex, Text } from '@wraft/ui';

import { ProfileCard } from 'common/ProfileCard';

export interface Comment {
  updated_at: string;
  parent_id: null;
  master_id: string;
  master: string;
  is_parent: boolean;
  inserted_at: string;
  id: string;
  comment: string;
  profile: Profile;
}

export interface Profile {
  uuid: string;
  profile_pic: string;
  name: string;
  gender: string;
  dob: Date;
}

const CommentCard = (comment: Comment) => {
  return (
    <Box
      key={comment?.id}
      borderBottom="solid 1px"
      borderColor="border"
      pb="md"
      mb="md">
      <Flex pl="0">
        <ProfileCard
          image={`${comment?.profile?.profile_pic}`}
          name={comment?.profile?.name}
          time={comment?.updated_at}
        />
      </Flex>
      <Box pl="md" pr="sm">
        <Text as="p" mt="xs" color="text-primary">
          {comment.comment}
        </Text>
      </Box>
    </Box>
  );
};
export default CommentCard;
