import { FC } from 'react';
import React, { useState } from 'react';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button, Flex, Box, PasswordInput, Field } from '@wraft/ui';
import { zodResolver } from '@hookform/resolvers/zod';

import OrgSidebar from 'common/OrgSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import { PasswordUpdate, PasswordUpdateSchema } from 'schemas/auth';
import { putAPI } from 'utils/models';

const Contents: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordUpdate>({
    resolver: zodResolver(PasswordUpdateSchema),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: PasswordUpdate) => {
    setLoading(true);

    try {
      const body = {
        password: data.new_password,
        current_password: data.current_password,
      };

      await putAPI(`user/password`, body);

      toast.success('Password updated successfully!', {
        duration: 1000,
        position: 'top-right',
      });
    } catch (e) {
      toast.error(e?.errors || 'Something went wrong. Please try again.', {
        duration: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Change Password | Wraft</title>
        <meta name="description" content="change your wraft password" />
      </Head>
      <Page>
        <PageHeader
          title="Change Password"
          desc={
            <DescriptionLinker
              data={[
                { name: 'Settings', path: '' },
                { name: 'Change Password', path: '' },
              ]}
            />
          }
        />

        <Flex gap="md" my="md" px="md">
          <OrgSidebar />
          <Box bg="background-primary" p="xl" w="50%" maxWidth="600px">
            <Flex
              direction="column"
              gap="md"
              as="form"
              onSubmit={handleSubmit(onSubmit)}>
              <Field
                label="Current Password"
                required
                error={errors?.current_password?.message as string}>
                <PasswordInput
                  placeholder="Enter your Current Password"
                  {...register('current_password')}
                />
              </Field>
              <Field
                label="New Password"
                required
                error={errors?.new_password?.message as string}>
                <PasswordInput
                  placeholder="Enter your New Password"
                  {...register('new_password')}
                />
              </Field>
              <Field
                label="Confirm New Password"
                required
                error={errors?.confirm_new_password?.message as string}>
                <PasswordInput
                  placeholder="Enter your Confirm New Password"
                  {...register('confirm_new_password')}
                />
              </Field>
              <Box mt="sm">
                <Button type="submit" loading={loading}>
                  Update Password
                </Button>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default Contents;
