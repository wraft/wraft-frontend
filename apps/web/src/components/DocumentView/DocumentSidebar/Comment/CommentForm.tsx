import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Text } from '@wraft/ui';
import { ChatCircleIcon } from '@phosphor-icons/react';

import Field from 'common/Field';
import { fetchAPI, postAPI } from 'utils/models';

import CommentCard from './CommentCard';

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

const CommentForm = ({ master, master_id }: CommentFormProps) => {
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [submiting, setSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const commentExample = {
      master_id: master_id,
      master: master,
      is_parent: true,
      comment: data.body,
    };

    try {
      await postAPI('comments', commentExample);
      fetchAPI(`comments?master_id=${master_id}&page=0`).then(
        (response: any) => {
          if (response.comments) {
            setComments(response.comments);
            setSubmitting(false);
            setValue('body', '');
          }
        },
      );
    } catch {
      console.error('comment error');
    }
  };

  useEffect(() => {
    fetchAPI(`comments?master_id=${master_id}&page=1`).then((data: any) => {
      if (data.comments) {
        setComments(data.comments);
      }
    });
  }, [master_id]);

  return (
    <>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} mb="lg">
        <Box mb="md">
          <Field name="body" label="" defaultValue="" register={register} />
          {errors.body && <Text>This field is required</Text>}
        </Box>
        <Button variant="primary" size="sm" type="submit" disabled={submiting}>
          <ChatCircleIcon size={16} weight="bold" color="#fff" />
          <Box>{submiting ? 'Saving ... ' : 'Add Comment'}</Box>
        </Button>
      </Box>
      {comments && comments.length > 0 && (
        <Box>
          {comments.map((comment: Comment) => (
            <CommentCard key={comment.id} {...comment} />
          ))}
        </Box>
      )}
    </>
  );
};
export default CommentForm;
