import React from 'react';
import { Box, Flex, Text } from 'theme-ui';
import { API_HOST } from '../utils/models';
import { ProfileCard } from './ContentDetail';

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
    <>
      <Box>
        <Box
          key={comment?.id}
          sx={{
            // bg: 'blue.0',
            borderBottom: 'solid 1px',
            borderColor: 'gray.3',
            pb: 3,
            mb: 2,
          }}
        >
          <Flex sx={{ display: 'inline-flex' }}>
            <Box sx={{ pl: 0 }}>
              <ProfileCard
                image={`${API_HOST}${comment?.profile?.profile_pic}`}
                name={comment?.profile?.name}
                time={comment?.updated_at}
              />
            </Box>
          </Flex>
          <Box sx={{ pl: 3 }}>
            <Text
              as="p"
              sx={{
                mt: 0,
                color: 'gray.7',
                fontSize: 1,
                pt: 0,
                lineHeight: 1.35,
                pl: 2,
                m: 0,
              }}
            >
              {comment.comment}
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default CommentCard;
