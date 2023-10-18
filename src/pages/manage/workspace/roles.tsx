import React, { FC } from 'react';
import Head from 'next/head';
import { Flex, Container, Button } from 'theme-ui';

import Page from '../../../components/PageFrame';
import PageHeader from '../../../components/PageHeader';
import ManageSidebar from '../../../components/ManageSidebar';
import { workspaceLinks } from '../../../utils';
import ModalCustom from '../../../components/ModalCustom';
import { InviteUserIcon } from '../../../components/Icons';
// import Table from '../../../components/Table';

const Index: FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <>
      <Head>
        <title>Layouts | Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <PageHeader title="Manage Layouts" desc="Document Layouts">
          <Button
            onClick={() => setIsOpen(true)}
            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InviteUserIcon />
            Invite people
          </Button>
        </PageHeader>
        <ModalCustom varient="right" isOpen={isOpen} setOpen={setIsOpen}>
          <div></div>
          {/* <LayoutForm /> */}
        </ModalCustom>
        <Container sx={{ px: 4, pt: 0 }}>
          <Flex>
            <ManageSidebar items={workspaceLinks} />
            <Flex>
              <Box
                sx={{
                  bg: 'bgWhite',
                  border: '1px solid',
                  borderColor: 'neutral.1',
                  borderRadius: 4,
                  flexGrow: 1,
                  // p: 4,
                  m: 4,
                  mr: 0,
                }}>
                {/* <Table
                  options={{
                    columns: [
                      {
                        Header: '',
                        accessor: 'col0', // accessor is the "key" in the data
                        width: 'auto',
                      },
                      {
                        Header: 'Name',
                        accessor: 'col1',
                        width: '59%',
                      },
                      {
                        Header: 'Time',
                        accessor: 'col2',
                        width: '14%',
                      },
                      {
                        Header: 'Editors',
                        accessor: 'col3',
                        width: '14%',
                      },
                      {
                        Header: 'Status',
                        accessor: 'status',
                        width: '14%',
                      },
                    ],
                    data: vendors,
                  }}
                /> */}
              </Box>
            </Flex>
            {/* <Workspace /> */}
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
