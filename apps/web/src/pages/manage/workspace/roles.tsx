import React, { FC, useState } from 'react';
import Head from 'next/head';
import { Flex, Container, Box, Input, Spinner } from 'theme-ui';
import { Plus } from '@phosphor-icons/react';
import { Button } from '@wraft/ui';

import { SearchIcon } from 'components/Icons';
import { RolesForm, RolesList } from 'components/manage';
import ManageSidebar from 'components/ManageSidebar';
import Page from 'components/PageFrame';
import PageHeader from 'common/PageHeader';
import { Drawer } from 'common/Drawer';
import DescriptionLinker from 'common/DescriptionLinker';
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
                  background: 'background-primary',
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

              <Button variant="primary" onClick={() => setIsOpen(true)}>
                <Plus size={14} weight="bold" />
                Create Role
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
