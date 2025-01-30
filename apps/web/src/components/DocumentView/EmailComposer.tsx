import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Flex } from 'theme-ui';
import { Button } from '@wraft/ui';
import { X } from '@phosphor-icons/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

import Field from 'common/Field';
import FieldText from 'common/FieldText';
import { postAPI } from 'utils/models';

const validationSchema: any = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  subject: yup
    .string()
    .min(4, 'Minimum 4 characters required')
    .transform((value) => value.trim())
    .optional(),
  message: yup
    .string()
    .trim()
    .min(5, 'Minimum 5 characters required')
    .optional(),
});

const formDefaultValues = {
  subject: '',
  email: '',
  message: '',
};

interface EmailComposerProps {
  id: string;
  setOpen: any;
}

const EmailComposer = ({ id, setOpen }: EmailComposerProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formDefaultValues,
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    postAPI(`contents/${id}/email`, data)
      .then(() => {
        setLoading(false);
        setOpen(false);
        toast.success('Build done successfully', {
          duration: 500,
          position: 'top-right',
        });
      })
      .catch(() => {
        setLoading(false);
        toast.error('Build Failed');
      });
  };
  return (
    <Box
      sx={{ width: '100ch', height: '100%' }}
      p={4}
      as="form"
      onSubmit={handleSubmit(onSubmit)}>
      <Flex
        sx={{ justifyContent: 'space-between', alignItems: 'center' }}
        mb={3}>
        <Box as="h3">New Mail</Box>
        <X
          size={20}
          weight="bold"
          cursor="pointer"
          onClick={() => setOpen(false)}
        />
      </Flex>
      <Box py={2}>
        <Field
          register={register}
          error={errors.email}
          label="To"
          name="email"
          defaultValue=""
          placeholder="Enter from Email"
        />
      </Box>
      <Box py={2}>
        <Field
          register={register}
          error={errors.subject}
          label="Subject"
          name="subject"
          defaultValue=""
          placeholder="Enter Subject"
        />
      </Box>
      <Box py={2} mb={3}>
        <FieldText
          register={register}
          label="Message"
          name="message"
          placeholder="Message"
          defaultValue=""
          rows={8}
        />
      </Box>
      <Button variant="primary" loading={loading} type="submit">
        Send Now
      </Button>
    </Box>
  );
};

export default EmailComposer;
