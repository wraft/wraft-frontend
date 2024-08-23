import React, { FC, useState } from 'react';
import Head from 'next/head';
import DescriptionLinker from '@wraft-ui/DescriptionLinker';
import { Drawer } from '@wraft-ui/Drawer';
import { Flex, Container, Button, Box, Input, Spinner } from 'theme-ui';

import { AddIcon, SearchIcon } from 'components/Icons';
import { RolesForm, RolesList } from 'components/manage';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'components/PageHeader';
import { useAuth } from 'contexts/AuthContext';
import { workspaceLinks } from 'utils/index';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterLoading, setFilterLoading] = useState<boolean>(false);

  const { userProfile } = useAuth();

  return (
    (userProfile?.currentOrganisation?.name !== 'Personal' || '') && (
      <>
        <Head>
          <title>Roles | Wraft</title>
          <meta name="description" content="workspace roles" />
        </Head>
        <Page>
          <PageHeader
            title="Workspace"
            desc={
              <DescriptionLinker
                data={[
                  { name: 'Manage', path: '/manage' },
                  { name: 'General' },
                ]}
              />
            }>
            <Flex sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: '347px',
                  display: 'flex',
                  background: 'backgroundWhite',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'border',
                  borderRadius: '6px',
                  mr: 2,
                }}>
                <Input
                  placeholder="Search by role names"
                  onChange={(e: any) => {
                    setFilterLoading(true);
                    setTimeout(() => setSearchTerm(e.target.value), 1000);
                  }}
                  sx={{
                    bg: 'transparent',
                    mb: 0,
                    border: 'none',
                    ':focus': {
                      outline: 'none',
                    },
                  }}></Input>
                <Box
                  sx={{
                    color: 'gray.300',
                    pr: 3,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  {filterLoading ? (
                    <Spinner width={14} />
                  ) : (
                    <SearchIcon className="searchIcon" />
                  )}
                </Box>
              </Box>

              <Button
                variant="buttonPrimarySmall"
                onClick={() => setIsOpen(true)}
                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AddIcon />
                Create new role
              </Button>
            </Flex>
          </PageHeader>
          <Drawer open={isOpen} setOpen={setIsOpen}>
            <RolesForm key={1} setOpen={setIsOpen} setRender={setRender} />
          </Drawer>
          <Container variant="layout.pageFrame">
            <Flex>
              <ManageSidebar items={workspaceLinks} />
              <Box variant="layout.contentFrame">
                <RolesList
                  render={render}
                  setRender={setRender}
                  searchTerm={searchTerm}
                  setFilterLoading={setFilterLoading}
                />
              </Box>
            </Flex>
          </Container>
        </Page>
      </>
    )
  );
  // }}
};

export default Index;
