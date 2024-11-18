import React, { FC, useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Flex, Container, Button, Box, Input, Label, Text } from 'theme-ui';

import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import DefaultAvatar from 'components/DefaultAvatar';
import PageHeader from 'common/PageHeader';
import Field from 'common/Field';
import Modal from 'common/Modal';
import DescriptionLinker from 'common/DescriptionLinker';
import Checkbox from 'common/Checkbox';
import { useAuth } from 'contexts/AuthContext';
import { PersonalWorkspaceLinks, workspaceLinks } from 'utils/index';
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
  const { register, handleSubmit } = useForm<FormInputs>({
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
      .catch((error) => {
        toast.error(
          'The OTP you entered is not valid. Please check your email for the correct code and try again.',
          {
            duration: 3000,
            position: 'top-right',
          },
        );
      });
  };

  const onSwitchOrganization = async (id: string) => {
    postAPI('switch_organisations', {
      organisation_id: id,
    })
      .then((res: any) => {
        login(res);
      })
      .catch(() => {
        toast.error('failed Switch', {
          duration: 1000,
          position: 'top-center',
        });
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
        <title>Workspace | Wraft</title>
        <meta name="description" content="wraft workspace" />
      </Head>
      <Page>
        <PageHeader
          title="Workspace"
          desc={
            <DescriptionLinker
              data={[{ name: 'Manage', path: '/manage' }, { name: 'General' }]}
            />
          }
        />
        <Container variant="layout.pageFrame">
          <Flex>
            <ManageSidebar
              items={
                currentOrg?.name !== 'Personal' || ''
                  ? workspaceLinks
                  : PersonalWorkspaceLinks
              }
            />
            <Flex sx={{ flexDirection: 'column', minWidth: '556px' }}>
              <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                variant="layout.contentFrame"
                sx={{ backgroundColor: 'backgroundWhite' }}
                p={4}>
                <Box sx={{ height: '128px', mb: 4, bg: 'gray' }}>
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
                <Field
                  label="Workspace name"
                  placeholder="Personal"
                  defaultValue={org?.name}
                  name="name"
                  register={register}
                  disable={!isEdit}
                  mb={'24px'}
                />
                {/* <Field
                  label="Workspace URL"
                  placeholder={'wraft.co/example'}
                  defaultValue={org?.url}
                  name="url"
                  register={register}
                  disable={!isEdit}
                /> */}
                <Box mt={'24px'}>
                  {isEdit ? (
                    <Button variant="buttonPrimary" type="submit">
                      Update
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEdit(true);
                      }}
                      variant="buttonSecondary">
                      Edit
                    </Button>
                  )}
                </Box>
                {(currentOrg?.name !== 'Personal' || '') && (
                  <Box
                    sx={{
                      borderTop: '1px solid',
                      borderColor: 'neutral.200',
                      mt: 4,
                    }}>
                    <Text
                      as={'p'}
                      variant="h6Medium"
                      sx={{ mb: 2, mt: 4, color: 'gray.600' }}>
                      Delete workspace
                    </Text>
                    <Text as={'p'} variant="pM" sx={{ mb: '24px' }}>
                      This workspace will be permanently removed from Wraft
                    </Text>
                    <Button onClick={onSendCode} type="button" variant="delete">
                      Delete Workspace
                    </Button>
                    <Modal
                      width="556px"
                      isOpen={isDelete}
                      onClose={() => setDelete(false)}>
                      <Text
                        variant="pB"
                        sx={{
                          py: 3,
                          px: 4,
                          display: 'inline-block',
                        }}>
                        Verify workspace delete request
                      </Text>
                      <Box
                        sx={{
                          pt: 3,
                          pb: 4,
                          borderTop: '1px solid',
                          borderColor: 'border',
                        }}>
                        <Box sx={{ px: 4 }}>
                          <Text
                            variant="pR"
                            sx={{
                              textWrap: 'balance',
                              display: 'inline-block',
                            }}>
                            If you are sure you want to proceed with deletion of
                            the workspace{' '}
                            <Text as={'span'} variant="pB">
                              {org?.name}
                            </Text>
                            , please enter the deletion code sent to your email.
                          </Text>
                          <Box sx={{ mt: '24px' }}>
                            <Label variant="text.pR" sx={{ color: 'gray.900' }}>
                              <span>Enter the deletion code to confirm</span>
                            </Label>
                            <Input ref={inputRef}></Input>
                          </Box>
                          <Label
                            sx={{
                              mt: '18px',
                              display: 'flex',
                              alignItems: 'flex-start',
                            }}>
                            <Checkbox
                              checked={isChecked}
                              onChange={handleCheckboxChange}
                              size={'small'}
                            />
                            <Text variant="subM" ml={2}>
                              I acknowledge I understand that all of the data
                              will be deleted and want to proceed
                            </Text>
                          </Label>
                          <Flex sx={{ gap: 3, pt: 4 }}>
                            <Button
                              disabled={!isChecked}
                              onClick={onConfirmDelete}
                              variant="delete">
                              Delete workspace
                            </Button>
                            <Button
                              onClick={() => setDelete(false)}
                              variant="cancel">
                              Cancel
                            </Button>
                          </Flex>
                        </Box>
                      </Box>
                    </Modal>
                  </Box>
                )}
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
