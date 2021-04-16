import { FC } from 'react';
import Head from 'next/head';
import { Box } from 'rebass';
import Link from '../../src/components/NavLink';
import LayoutList from '../../src/components/LayoutList';
import Page from '../../src/components/Page';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Login - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Box>
          <Box sx={{ ml: 'auto' }}>
            <Link variant="button" href="/layouts/new">
              <a>Add Layout</a>
            </Link>
          </Box>
        </Box>
        <Box>
          <LayoutList />
        </Box>
      </Page>
    </>
  );
};

export default Index;
