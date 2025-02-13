import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Box, Flex, Text, Field, InputText, Textarea } from '@wraft/ui';
import { X } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { postAPI } from 'utils/models';

const validationSchema = z.object({
  email: z.string().email('Invalid email').nonempty('Required'),
  subject: z
    .string()
    .min(4, 'Minimum 4 characters required')
    .transform((value) => value.trim())
    .optional(),
  message: z
    .string()
    .min(5, 'Minimum 5 characters required')
    .optional()
    .transform((value) => (value ? value.replace(/\n/g, '<br>') : value)),
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
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    console.log('data', data);

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
    <Box w="80ch" h="100%" p={4} as="form" onSubmit={handleSubmit(onSubmit)}>
      <Flex justifyContent="space-between" alignItems="center" mb={3}>
        <Text as="h3" fontSize="2xl" mb="md">
          New Mail
        </Text>
        <X
          size={20}
          weight="bold"
          cursor="pointer"
          className="main-icon"
          onClick={() => setOpen(false)}
        />
      </Flex>
      <Flex direction="column" gap="md">
        <Field label="To" required error={errors?.email?.message}>
          <InputText
            type="email"
            {...register('email')}
            placeholder="Enter To email address"
          />
        </Field>

        <Field label="Subject" required error={errors?.subject?.message}>
          <InputText {...register('subject')} placeholder="Enter Subject" />
        </Field>

        <Field label="Message" required error={errors?.message?.message}>
          <Textarea {...register('message')} placeholder="Enter a Message" />
        </Field>

        <Box>
          <Button variant="primary" loading={loading} type="submit">
            Send Now
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default EmailComposer;
