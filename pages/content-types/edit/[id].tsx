import { FC } from 'react';
import Head from 'next/head';
import ContentTypeForm from '../../../src/components/ContentTypeForm';
import Page from '../../../src/components/PageFrame';
import { Container } from 'theme-ui';

const Index: FC = () => {
  return (
    <>
      <Head>
        <title>Edit Layout - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <Container sx={{ px: 4}}>
          <ContentTypeForm />
        </Container>
      </Page>
    </>
  );
};

export default Index;
