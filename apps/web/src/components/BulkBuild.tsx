import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Flex, Button, Text, Image } from 'theme-ui';

import { TimeAgo } from 'common/Atoms';
import { API_HOST, postAPI, fetchAPI } from 'utils/models';

import Field from './FieldText';

export interface Comments {
  total_pages: number;
  total_entries: number;
  page_number: number;
  comments: Comment[];
}

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

interface CommentFormProps {
  master: string;
  master_id: string;
}

export interface Profile {
  uuid: string;
  profile_pic: string;
  name: string;
  gender: string;
  dob: Date;
}

export interface User {
  updated_at: Date;
  name: string;
  inserted_at: Date;
  id: string;
  email_verify: boolean;
  email: string;
}

const BulkBuild = ({ master, master_id }: CommentFormProps) => {
  const [comments, setComments] = useState<Array<Comment>>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData: any) => {
    const commentExample = {
      master_id: master_id,
      master: master,
      is_parent: true,
      comment: formData.body,
    };
    postAPI('comments', commentExample);
    fetchAPI(`comments?master_id=${master_id}&page=0`).then((response: any) => {
      if (response.comments) {
        setComments(response.comments);
      }
    });
  };

  useEffect(() => {
    fetchAPI(`comments?master_id=${master_id}&page=1`).then((data: any) => {
      if (data.comments) {
        setComments(data.comments);
      }
    });
  }, [master_id]);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} mt={4}>
      {comments && comments.length > 0 && (
        <Box>
          {comments.map((comment: Comment, index) => (
            <Box
              key={index}
              // pb={2}
              // pt={2}
              mb={1}
              sx={{
                borderBottom: 'solid 1px',
                borderColor: 'border',
                pb: 3,
                mb: 2,
              }}>
              <Flex sx={{ display: 'inline-flex' }}>
                <Box sx={{ pl: 3 }}>
                  <Flex
                    sx={{
                      // ml: -4,
                      pt: 0,
                      width: 'auto',
                      // bg: 'red.200',
                      // border: 'solid 1px',
                      // borderColor: 'red.400',
                      borderRadius: 99,
                      pr: 2,
                      alignItems: 'flex-start',
                    }}>
                    <Image
                      alt=""
                      sx={{
                        // border: 'solid 2px',
                        // borderColor: 'red.600',
                        borderRadius: 99,
                        mr: 2,
                        width: '24px',
                        height: '24px',
                      }}
                      src={`${API_HOST}${comment?.profile?.profile_pic}`}
                    />
                    <Text
                      sx={{
                        pl: 0,
                        fontSize: 'base',
                        pb: 0,
                        fontWeight: 600,
                        pt: '1px',
                      }}>
                      {comment?.profile?.name}
                    </Text>
                    <Box as="span" pl={1}>
                      <TimeAgo time={comment?.updated_at} />
                    </Box>
                  </Flex>

                  <Text as="p" sx={{ mt: 0, fontSize: 'base', pt: 1, m: 0 }}>
                    {comment.comment}
                  </Text>
                </Box>
              </Flex>
            </Box>
          ))}
        </Box>
      )}
      <Box>
        <Text mb={3} mt={3}>
          Add Comment
        </Text>
      </Box>
      <Box mx={0} mb={0}>
        <Flex>
          <Box>
            <Field name="body" label="" defaultValue="" register={register} />
          </Box>
          {errors.body && <Text>This field is required</Text>}
        </Flex>
      </Box>
      <Button ml={0}>Add Comment</Button>
    </Box>
  );
};
export default BulkBuild;
