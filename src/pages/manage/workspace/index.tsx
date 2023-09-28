import React, { FC } from 'react';
import Head from 'next/head';
import {
  Flex,
  Container,
  Button,
  Box,
  Input,
  Label,
  Text,
  Image,
  Checkbox,
} from 'theme-ui';
import { useForm } from 'react-hook-form';
import { useStoreState } from 'easy-peasy';
import {
  checkUser,
  loadEntityDetail,
  updateEntityFile,
  deleteEntity,
} from '../../../utils/models';

import { useToasts } from 'react-toast-notifications';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import ModalCustom from '../../../components/ModalCustom';
import { InviteUserIcon } from '../../../components/Icons';
import Field from '../../../components/Field';

export interface Organisation {
  id: string;
  name: string;
  address: string;
  url: string;
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
  logo: FileList;
  name: string;
  url: string;
  // file: any;
};

const Index: FC = () => {
  const {
    register,
    handleSubmit,
    // formState: { errors },
  } = useForm<FormInputs>({ mode: 'all' });
  const token = useStoreState((state) => state.auth.token);
  const { addToast } = useToasts();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDelete, setDelete] = React.useState(false);
  const [isConfirmDelete, setConfirmDelete] = React.useState(false);
  const [orgId, setOrgId] = React.useState('');
  const [org, setOrg] = React.useState<Organisation>();
  const [logoSrc, setLogoSrc] = React.useState(org?.logo);
  const fileRef = React.useRef<HTMLInputElement | null>(null);
  const [isChecked, setIsChecked] = React.useState(false);

  const onUpdate = (data: any) => {
    console.log(data);
  };
  const onSuccess = (data: any) => {
    setOrgId(data.organisation_id);
  };
  const onLoad = (data: any) => {
    setOrg(data);
    console.table(data);
  };

  React.useEffect(() => {
    checkUser(token, onSuccess);
  }, []);

  React.useEffect(() => {
    if (orgId) {
      loadEntityDetail(token, `organisations`, orgId, onLoad);
    }
  }, [orgId]);

  const backupLogo =
    'https://imagedelivery.net/5MYSbk45M80qAwecrlKzdQ/2dab3411-8db4-4673-6e4b-f3a9aa5b0900/preview';

  React.useEffect(() => {
    if (org?.logo) {
      setLogoSrc(org?.logo);
    } else {
      setLogoSrc(backupLogo);
    }
  }, [org]);

  const onSubmit = (data: any) => {
    console.log(data);

    const formData = new FormData();
    // if (data.file && data.file.length > 0) {
    //   formData.append('logo', data.file[0]);
    // }
    formData.append('logo', data.logo[0]);
    if (data.name !== 'Personal' && data.name !== '') {
      formData.append('name', data.name);
    }
    if (data.url !== '') {
      formData.append('url', data.url);
    }

    if (orgId) {
      updateEntityFile(`organisations/${orgId}`, formData, token, onUpdate);
      addToast(`Updated Workspace ${data.name}`, { appearance: 'success' });
    }
  };

  const onConfirmDelete = () => {
    deleteEntity(`/organisations/${orgId}`, token);
  };

  const [previewSource, setPreviewSource] = React.useState<
    string | undefined | null
  >(undefined);
  const handleImageUpload = (event: any) => {
    const file = event.target.files[0];
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
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Head>
        <title>Workspace | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Team management" desc="Manage  >  Workspace">
          <Button
            onClick={() => setIsOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InviteUserIcon />
            Invite people
          </Button>
        </PageHeader>
        <ModalCustom varient="right" isOpen={isOpen} setOpen={setIsOpen}>
          {/* <LayoutForm /> */}
        </ModalCustom>
        <Container
          sx={{
            px: 4,
            pt: 0,
            maxHeight: '90vh',
            overflow: 'auto',
            bg: 'background',
          }}>
          <Flex>
            <ManageSidebar items={workspaceLinks} />
            <Box>
              <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  bg: 'bgWhite',
                  border: '1px solid',
                  borderColor: 'neutral.1',
                  borderRadius: 4,
                  p: 4,
                  m: 4,
                }}>
                <Image
                  variant="profile"
                  src={previewSource ? previewSource : logoSrc}
                  alt="logo"
                  onError={() => setLogoSrc(backupLogo)}
                  onClick={() => fileRef.current?.click()}
                  sx={{ mb: 4 }}
                />
                {/* <Label htmlFor="file">Logo</Label> */}
                <Input
                  sx={{ display: 'none' }}
                  type="file"
                  {...register('logo')}
                  accept=".jpg,.png,.gif"
                  ref={fileRef}
                  onChange={handleImageUpload}
                />
                <Field
                  disable={org?.name === 'Personal'}
                  label="Workspace name"
                  placeholder="Personal"
                  defaultValue={org?.name}
                  name="name"
                  register={register}
                  // error={errors.name}
                />
                <Field
                  label="Workspace URL"
                  placeholder={'wraft.co/example'}
                  defaultValue={org?.url}
                  name="url"
                  register={register}
                  // error={errors.url}
                />
                <Button sx={{ mt: '18px' }} type="submit">
                  Update
                </Button>
              </Box>
              <Box
                sx={{
                  bg: 'bgWhite',
                  border: '1px solid',
                  borderColor: 'neutral.1',
                  borderRadius: 4,
                  p: 4,
                  m: 4,
                }}>
                <Text variant="pR" sx={{ display: 'inline-block', mb: 2 }}>
                  Workspace removal
                </Text>
                <br />
                <Text variant="pM" sx={{ display: 'inline-block', mb: '18px' }}>
                  This workspace will be permanently removed from Wraft
                </Text>
                <br />
                {/* <Button
                  onClick={() => setDelete(true)}
                  type="button"
                  variant="delete">
                  Delete Workspace
                </Button> */}
                <Button
                  onClick={() => setDelete(true)}
                  type="button"
                  variant="delete">
                  Delete Workspace
                </Button>
                <ModalCustom isOpen={isDelete} setOpen={setDelete}>
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
                      borderColor: 'neutral.1',
                    }}>
                    <Box sx={{ px: 4 }}>
                      <Text
                        variant="pR"
                        sx={{ textWrap: 'balance', display: 'inline-block' }}>
                        If you are sure you want to proceed with deletion of the
                        workspace{' '}
                        <Text as={'span'} variant="pB">
                          Functionary
                        </Text>
                        , please enter the deletion sent to your email.
                      </Text>
                      <Box sx={{ mt: '24px' }}>
                        <Label variant="text.pR" sx={{ color: 'gray.8' }}>
                          Enter the deletion code
                        </Label>
                        <Input></Input>
                      </Box>
                      <Label sx={{ mt: '18px' }}>
                        <Checkbox
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />
                        <Text variant="subM">
                          I acknowledge I understand that all of the data will
                          be deleted and want to proceed
                        </Text>
                      </Label>
                      <Flex sx={{ gap: 3, pt: 4 }}>
                        <Button
                          onClick={() => {
                            setDelete(false);
                            setConfirmDelete(true);
                          }}
                          // sx={{ bg: 'red.7' }}
                          variant="delete">
                          Delete workspace
                        </Button>
                        {/* <Button onClick={onConfirmDelete} sx={{ bg: 'red.5' }}>
                          Yes
                        </Button> */}
                        <Button
                          onClick={() => setDelete(false)}
                          variant="cancel">
                          Cancel
                        </Button>
                      </Flex>
                    </Box>
                  </Box>
                </ModalCustom>
                <ModalCustom
                  isOpen={isConfirmDelete}
                  setOpen={setConfirmDelete}>
                  <Box sx={{ maxWidth: '342px' }}>
                    <Text
                      variant="pB"
                      sx={{ display: 'inline-block', py: 3, px: 4 }}>
                      Delete workspace
                    </Text>
                    <Box
                      sx={{ borderTop: '1px solid', borderColor: 'neutral.1' }}>
                      <Box sx={{ px: 4 }}>
                        <Text
                          variant="pM"
                          sx={{ display: 'inline-block', pt: 3 }}>
                          Are you sure you want to delete this workspace?
                        </Text>
                        <Flex sx={{ gap: 3, py: 4 }}>
                          <Button
                            onClick={() => {
                              onConfirmDelete;
                            }}
                            variant="delete"
                            sx={{
                              fontSize: 2,
                              flexGrow: 1,
                            }}>
                            Confirm
                          </Button>
                          <Button
                            onClick={() => setConfirmDelete(false)}
                            variant="cancel"
                            sx={{
                              fontSize: 2,
                              flexGrow: 1,
                            }}>
                            Cancel
                          </Button>
                        </Flex>
                      </Box>
                    </Box>
                  </Box>
                </ModalCustom>
              </Box>
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
