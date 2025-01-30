import { FC } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flex, Container } from 'theme-ui';

import PipelineForm from 'components/Pipeline/PipelineForm';
import Page from 'common/PageFrame';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Create Pipeline | Wraft</title>
        <meta name="description" content="create new pipeline" />
      </Head>
      <Page>
        <Flex>
          <Link href="/pipelines">Back</Link>
          <Container sx={{ maxWidth: '60ch', mx: 'auto' }}>
            <PipelineForm />
          </Container>
        </Flex>
      </Page>
    </>
  );
};

export default Index;
