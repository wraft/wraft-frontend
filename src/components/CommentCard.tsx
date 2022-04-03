import React from 'react';
import { Box, Flex, Text, Image } from 'theme-ui'; import { API_HOST } from '../utils/models';
;
import { TimeAgo } from './Atoms';

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
          }}>
          <Flex sx={{ display: 'inline-flex' }}>
            <Box sx={{ pl: 0 }}>
              <Flex
                sx={{
                  pt: 0,
                  width: 'auto',
                  pr: 2,
                  alignItems: 'flex-start',
                }}>
                <Image
                  variant="layout.avatar"
                  src={`${API_HOST}${comment?.profile?.profile_pic}`}
                />
                <Text
                  sx={{
                    pl: 0,
                    fontSize: 1,
                    pb: 0,
                    fontWeight: 600,
                    // minWidth: '120px',
                    pt: 0,
                    ml: 2,
                    color: 'blue.9',
                  }}>
                  {comment?.profile?.name}
                </Text>

                <Box as="span" pl={1}>
                  <TimeAgo time={comment?.updated_at} />
                </Box>
              </Flex>
            </Box>
          </Flex>
          <Box sx={{ pl: 4 }}>
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
              }}>
              {comment.comment}
            </Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};
export default CommentCard;
