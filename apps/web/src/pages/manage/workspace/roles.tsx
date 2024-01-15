import React, { FC, useEffect, useState } from 'react';

import { Drawer } from '@wraft-ui/Drawer';
import Head from 'next/head';
import { Flex, Container, Button, Box, Input } from 'theme-ui';

import { AddIcon, SearchIcon } from '../../../components/Icons';
import { RolesAdd, RolesList } from '../../../components/manage';
import ManageSidebar from '../../../components/ManageSidebar';
import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import { useAuth } from '../../../contexts/AuthContext';
import { workspaceLinks } from '../../../utils';
import { fetchAPI } from '../../../utils/models';

const Index: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [render, setRender] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { userProfile } = useAuth();

  useEffect(() => {
    fetchAPI('roles').then(() => {
      console.log('success');
    });
  }, []);

  return (
    (userProfile?.currentOrganisation?.name !== 'Personal' || '') && (
      <>
        <Head>
          <title>Layouts | Wraft Docs</title>
          <meta name="description" content="a nextjs starter boilerplate" />
        </Head>
        <Page>
          <PageHeader title="Manage roles" desc="Document Layouts">
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
                  onChange={(e: any) => setSearchTerm(e.target.value)}
                  sx={{
                    bg: 'transparent',
                    mb: 0,
                    border: 'none',
                    ':focus': {
                      outline: 'none',
                    },
                  }}
                />
                <Box
                  sx={{
                    color: 'gray.300',
                    pr: 3,
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <SearchIcon className="searchIcon" />
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
            <RolesAdd key={1} setOpen={setIsOpen} setRender={setRender} />
          </Drawer>
          <Container variant="layout.newPageFrame">
            <Flex>
              <ManageSidebar items={workspaceLinks} />
              <Box variant="layout.contentFrame">
                <RolesList
                  render={render}
                  setRender={setRender}
                  searchTerm={searchTerm}
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
