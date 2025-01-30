import { FC } from 'react';
import React, { useState } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Button } from '@wraft/ui';
import { Text } from 'theme-ui';

import OrgSidebar from 'common/OrgSidebar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import Field from 'common/Field';
import { putAPI } from 'utils/models';

const Contents: FC = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    const { current_password, new_password, confirm_new_password } = data;
    // Custom validation logic
    clearErrors();
    if (new_password.length < 8) {
      setError('new_password', {
        type: 'manual',
        message: 'New password must be at least 8 characters',
      });
    }

    if (confirm_new_password !== new_password) {
      setError('confirm_new_password', {
        type: 'manual',
        message: 'Passwords must match',
      });
    }

    // If there are errors, return early
    if (Object.keys(errors).length > 0) {
      return;
    }

    setLoading(true);

    const body = {
      password: new_password,
      current_password: current_password,
    };
    putAPI(`user/password`, body)
      .then(() => {
        toast.success('updated Successfully', {
          duration: 1000,
          position: 'top-right',
        });
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e?.errors || 'somthing wrong', {
          duration: 3000,
          position: 'top-right',
        });
        setLoading(false);
      });
  };

  return (
    <>
      <Head>
        <title>Change Password | Wraft</title>
        <meta name="description" content="change your wraft password" />
      </Head>
      <Page>
        <PageHeader title="Settings" />
        <Container variant="layout.pageFrame">
          <Flex>
            <OrgSidebar />
            <Box sx={{ bg: 'white', width: '100%' }} pl={4} pt={4}>
              <Box sx={{ width: '40%' }}>
                <Text as="h3" mb={2} sx={{ mb: 3 }}>
                  Change Password
                </Text>
                <Box mx={0} mb={3} as="form" onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ py: 2 }}>
                    <Field
                      name="current_password"
                      label="Current Password"
                      variant="baseInput"
                      type="password"
                      placeholder="Enter your Current Password"
                      register={register}
                      error={errors.current_password}
                    />
                  </Box>
                  <Box sx={{ py: 2 }}>
                    <Field
                      name="new_password"
                      label="New Password"
                      variant="baseInput"
                      type="password"
                      placeholder="Enter your New Password"
                      register={register}
                      error={errors.new_password}
                    />
                  </Box>
                  <Box sx={{ pt: 2, pb: 4 }}>
                    <Field
                      name="confirm_new_password"
                      label="Confirm New Password"
                      variant="baseInput"
                      type="password"
                      placeholder="Enter your Confirm New Password"
                      register={register}
                      error={errors.confirm_new_password}
                    />
                  </Box>
                  <Button type="submit" disabled={loading} loading={loading}>
                    Update Password
                  </Button>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Contents;
