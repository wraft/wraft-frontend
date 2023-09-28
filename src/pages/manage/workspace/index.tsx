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

const Index: FC = () => {
  const {
    // watch,
    register,
    // control,
    handleSubmit,
    formState: { errors },
    // setValue,
  } = useForm<{
    name: string;
    url: string;
    logo: FileList;
  }>({ mode: 'all' });

  const { addToast } = useToasts();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isDelete, setIsDelete] = React.useState(false);
  const token = useStoreState((state) => state.auth.token);
  const [orgId, setOrgId] = React.useState('');
  const [org, setOrg] = React.useState<Organisation>();
  const [logoSrc, setLogoSrc] = React.useState(org?.logo);

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
    if (data.name !== 'Personal') {
      formData.append('name', data.name);
    }
    formData.append('logo', data.logo);
    formData.append('url', data.url);

    if (orgId) {
      updateEntityFile(`organisations/${orgId}`, formData, token, onUpdate);
      addToast(`Updated Workspace ${data.name}`, { appearance: 'success' });
    }
  };
  const onConfirmDelete = () => {
    deleteEntity(`/organisations/${orgId}`, token);
  };
  React.useEffect(() => {
    document.body.style.maxHeight = '100vh';
    document.body.style.overflow = 'none';
  }, []);
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
        <Container sx={{ px: 4, pt: 0, maxHeight: '90vh', overflow: 'auto' }}>
          <Flex>
            <ManageSidebar items={workspaceLinks} />
            <Box>
              <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  border: '1px solid',
                  borderColor: 'neutral.2',
                  p: 4,
                  m: 4,
                }}>
                <Image
                  variant="profile"
                  src={logoSrc}
                  alt="logo"
                  onError={() => setLogoSrc(backupLogo)}
                />
                <Label htmlFor="file">Logo</Label>
                <Input
                  type="file"
                  {...register('logo')}
                  accept=".jpg,.png,.gif"
                />
                <Field
                  disable={org?.name === 'Personal'}
                  label="Workspace name"
                  placeholder={org?.name ? org.name : 'Personal'}
                  defaultValue={org?.name ? org.name : 'Personal'}
                  name="name"
                  register={register}
                  error={errors.name}
                />
                <Field
                  label="Workspace URL"
                  placeholder={org?.url ? `${org.name}` : 'wraft.co/example'}
                  defaultValue={org?.url ? `${org.name}` : 'wraft.co/example'}
                  name="url"
                  register={register}
                  error={errors.url}
                />
                <Button type="submit">Update</Button>
              </Box>
              <Box
                sx={{
                  border: '1px solid',
                  borderColor: 'neutral.2',
                  p: 4,
                  m: 4,
                }}>
                <Text>Account Removal</Text>
                <br />
                <Text variant="capM">
                  Deleting your account will permanently remove your account
                </Text>
                <br />
                <Button
                  onClick={() => setIsDelete(true)}
                  type="button"
                  sx={{ bg: 'red.5' }}>
                  Delete Workspace
                </Button>
                <ModalCustom isOpen={isDelete} setOpen={setIsDelete}>
                  <Box sx={{ p: 5 }}>
                    <Text sx={{ textWrap: 'balance', textAlign: 'center' }}>
                      Are you sure you want to delete this workspace?
                    </Text>
                    <Flex sx={{ gap: 4, pt: 4, justifyContent: 'center' }}>
                      <Button onClick={onConfirmDelete} sx={{ bg: 'red.5' }}>
                        Yes
                      </Button>
                      <Button
                        onClick={() => setIsDelete(false)}
                        sx={{ bg: 'green.5' }}>
                        No
                      </Button>
                    </Flex>
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