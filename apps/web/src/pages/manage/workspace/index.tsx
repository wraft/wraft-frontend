import React, { FC, useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Input, Label } from 'theme-ui';
import { Box, Field, Flex, InputText, Text, Button, Modal } from '@wraft/ui';

import { PersonalWorkspaceLinks, workspaceLinks } from '@constants/menuLinks';
import ManageSidebar from 'common/ManageSidebar';
import DefaultAvatar from 'common/DefaultAvatar';
import Page from 'common/PageFrame';
import PageHeader from 'common/PageHeader';
import DescriptionLinker from 'common/DescriptionLinker';
import Checkbox from 'common/Checkbox';
import { PageInner } from 'common/Atoms';
import { useAuth } from 'contexts/AuthContext';
import { fetchAPI, putAPI, deleteAPI, postAPI } from 'utils/models';

export interface Organisation {
  id: string;
  name: string;
  address: string;
  url?: string;
  logo: string;
  email: string;
  phone: string;
  corporate_id: string;
  gstin: string;
  legal_name: string;
  name_of_ceo: string;
  name_of_cto: string;
}

type FormInputs = {
  // logo: FileList;
  logo: any;
  name: string;
  url?: string;
};

const Index: FC = () => {
  const { register, handleSubmit, setValue } = useForm<FormInputs>({
    mode: 'onSubmit',
  });
  const [isDelete, setDelete] = useState(false);
  const [org, setOrg] = useState<Organisation>();
  const [logoSrc, setLogoSrc] = useState(org?.logo);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { userProfile, login } = useAuth();
  const router = useRouter();

  const orgId = userProfile?.organisation_id || null;
  const currentOrg = userProfile?.currentOrganisation || null;

  const [previewSource, setPreviewSource] = useState<string | undefined | null>(
    undefined,
  );

  useEffect(() => {
    if (orgId) {
      fetchAPI(`organisations/${orgId}`).then((data: any) => {
        setValue('name', data?.name || '');
        setOrg(data);
      });
    }
  }, [orgId]);

  useEffect(() => {
    const logo = org?.logo;
    setLogoSrc(logo);
  }, [org]);

  const onConfirmDelete = async () => {
    const code = inputRef.current?.value;
    await deleteAPI(`organisations?code=${code}`)
      .then((res) => {
        setDelete(false);
        toast.success('Deleted workspace successfully', {
          duration: 4000,
          position: 'top-right',
        });

        login(res);
        router.push('/');
      })
      .catch(() => {
        toast.error(
          'The OTP you entered is not valid. Please check your email for the correct code and try again.',
          {
            duration: 3000,
            position: 'top-right',
          },
        );
      });
  };

  /**
   * Upload a Logo
   */

  // /**
  //  * Upload Cropped Image
  //  * @param f blob string
  //  */
  const onBlobReady = (file: File) => {
    // const file: File = base64ToFile(f, 'file_232.jpg');
    const formData = new FormData();

    if (file) {
      formData.append('logo', file);
    }

    if (orgId) {
      const updateRequest = putAPI(`organisations/${orgId}`, formData);

      toast.promise(updateRequest, {
        loading: 'Loading...',
        success: `Updated Workspace Image`,
        error: `Failed to Update Workspace Image`,
      });
    }
  };

  const onSendCode = () => {
    postAPI('organisations/request_deletion', {})
      .then(() => {
        setDelete(true);
        toast.success(
          'An OTP has been sent to your email. Please check your inbox to verify and proceed with the organization deletion.',
          {
            duration: 4000,
            position: 'top-right',
          },
        );
      })
      .catch((err) => {
        toast.error(JSON.stringify(err) || 'Failed to delete workspace', {
          duration: 3000,
          position: 'top-right',
        });
      });
  };

  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
    onBlobReady(file);
    previewFile(file);
  };
  const previewFile = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      if (reader !== null) {
        setPreviewSource(reader.result as string | null | undefined);
      }
    };
  };

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  const onSubmit = (data: any) => {
    const formData = new FormData();
    if (data.logo && data.logo.length > 0) {
      formData.append('logo', data.logo[0]);
    }
    if (data.name !== 'Personal' && data.name !== '') {
      formData.append('name', data.name);
    }
    // if (data.url !== '') {
    //   formData.append('url', data.url);
    // }

    if (orgId) {
      const updateRequest = putAPI(`organisations/${orgId}`, formData);
      toast.promise(
        updateRequest,
        {
          loading: 'Loading...',
          success: () => {
            setIsEdit(false);
            return `Updated Workspace ${data.name}`;
          },
          error: () => {
            setIsEdit(false);
            return `Failed to Update Workspace ${data.name}`;
          },
        },
        {
          duration: 1000,
          position: 'top-right',
        },
      );
    }
  };

  const orgImage = previewSource ? previewSource : logoSrc;

  return (
    <>
      <Head>
        <title>Manage Workspace | Wraft</title>
        <meta name="description" content="wraft workspace" />
      </Head>
      <Page>
        <PageHeader
          title={[
            { name: 'Manage', path: '/manage' },
            { name: 'Workspace', path: '/manage/workspace' },
          ]}
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'General' }]}
            />
          }
        />

        <PageInner>
          <Flex gap="xl" flex={1}>
            <ManageSidebar
              items={
                currentOrg?.name !== 'Personal' || ''
                  ? workspaceLinks
                  : PersonalWorkspaceLinks
              }
            />
            <Flex
              bg="background-primary"
              direction="column"
              flex={1}
              minWidth="556px"
              border="solid 1px"
              borderColor="gray.400"
              borderRadius="lg"
              p="xl">
              <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                variant="layout.contentFrame"
                mb="md">
                <Box mb="md">
                  {orgImage && (
                    <Box onClick={() => fileRef.current?.click()}>
                      <DefaultAvatar
                        url={previewSource ? previewSource : logoSrc}
                        value={org?.name}
                        size={120}
                      />
                    </Box>
                  )}
                </Box>
                <Input
                  sx={{ display: 'none' }}
                  type="file"
                  {...register('logo')}
                  accept=".jpg,.jpeg,.png"
                  ref={fileRef}
                  onChange={handleImageUpload}
                />
                <Field label="Workspace Name" disabled={!isEdit} required>
                  <InputText
                    {...register('name')}
                    placeholder="Enter a Workspace Name"
                  />
                </Field>
                {/* <Field label="Workspace URL" disabled={!isEdit} required>
                <InputText
                  {...register('url')}
                  placeholder="Enter a custom url wraft.co/example"
                />
              </Field> */}

                <Box mt="md">
                  {isEdit ? (
                    <Button type="submit">Update</Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEdit(true);
                      }}>
                      Edit
                    </Button>
                  )}
                </Box>
                {(currentOrg?.name !== 'Personal' || '') && (
                  <Box
                    mt="xl"
                    borderTop="1px solid"
                    borderColor="border"
                    py="md">
                    <Text as="h5">Delete workspace</Text>
                    <Text as={'p'} color="text-secondary" mb="md">
                      This workspace will be permanently removed from Wraft
                    </Text>
                    <Button
                      onClick={onSendCode}
                      danger
                      type="button"
                      variant="primary">
                      Delete Workspace
                    </Button>
                    <Modal
                      ariaLabel="delete workspace"
                      open={isDelete}
                      onClose={() => setDelete(false)}>
                      <>
                        <Modal.Header>
                          Verify workspace delete request
                        </Modal.Header>

                        <Box>
                          <Text color="text-secondary" as="p">
                            If you are sure you want to proceed with deletion of
                            the workspace{' '}
                            <Text as="span" fontWeight="bold">
                              {org?.name}
                            </Text>
                            , please enter the deletion code sent to your email.
                          </Text>
                          <Box mt="md">
                            <Label>
                              <span>Enter the deletion code to confirm</span>
                            </Label>
                            <Input ref={inputRef}></Input>
                          </Box>
                          <Label>
                            <Checkbox
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                              size={'small'}
                            />
                            <Text>
                              I acknowledge I understand that all of the data
                              will be deleted and want to proceed
                            </Text>
                          </Label>
                          <Flex pt="md" gap="sm">
                            <Button
                              danger
                              disabled={!isChecked}
                              onClick={onConfirmDelete}
                              variant="primary">
                              Delete workspace
                            </Button>
                            <Button
                              onClick={() => setDelete(false)}
                              variant="tertiary">
                              Cancel
                            </Button>
                          </Flex>
                        </Box>
                      </>
                    </Modal>
                  </Box>
                )}
              </Box>
            </Flex>
          </Flex>
        </PageInner>
      </Page>
    </>
  );
};

export default Index;
