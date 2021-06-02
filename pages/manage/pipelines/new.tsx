import { FC } from 'react';
import Head from 'next/head';
import PipelineForm from '../../../src/components/PipelineForm';

import Page from '../../../src/components/PageFrame';
import { Flex, Container } from 'theme-ui';
import Link from 'next/link';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Pipeline - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page>
        <Flex>
          <Link href="/manage/pipelines">
            <a>Back</a>
          </Link>
          <Container sx={{ maxWidth: '60ch', mx: 'auto'}}>
            <PipelineForm />
          </Container>
        </Flex>
      </Page>
    </>
  );
};

export default Index;
