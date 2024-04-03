import { FC, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Flex } from 'theme-ui';

import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';
import PageHeader from 'components/PageHeader';

const Index: FC = () => {
  const [items, setItems] = useState<any>();
  return (
    <>
      <Head>
        <title>Create Collection Form - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <PageHeader
          title="Form"
          // desc={<DescriptionLinker data={[{ name: 'Form' }]} />}
        />
        <Container variant="layout.pageFrame">
          <Flex>
            {/* <ManageSidebar items={menuLinks} /> */}
            <Box sx={{ width: '100%', bg: 'white', p: 4 }}>
              <FormsFrom items={items} setItems={setItems} />
            </Box>
          </Flex>
        </Container>
      </Page>
    </>
  );
};

export default Index;
