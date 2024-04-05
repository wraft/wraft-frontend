import { FC, useState } from 'react';
import Head from 'next/head';
import { Box, Container, Flex, Text } from 'theme-ui';

import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';
import PageHeader from 'components/PageHeader';
import FormFieldDroppable from 'components/FormFieldDroppable';
import MenuStepsIndicator from 'components/MenuStepsIndicator';

const Index: FC = () => {
  const [items, setItems] = useState<any>([]);
  const [formStep, setFormStep] = useState<number>(0);

  const goTo = (step: number) => {
    setFormStep(step);
  };
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
        <Flex>
          <Container variant="layout.pageFrame">
            <Flex>
              <MenuStepsIndicator
                formStep={formStep}
                goTo={goTo}
                titles={['Questions', 'Responses']}
              />
              <Box
                sx={{
                  display: formStep === 0 ? 'block' : 'none',
                  width: '100%',
                  bg: 'white',
                }}>
                <FormsFrom items={items} setItems={setItems} />
              </Box>
              <Box
                sx={{
                  display: formStep === 1 ? 'block' : 'none',
                  width: '100%',
                  bg: 'white',
                }}>
                <Flex
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <Text variant="h4Bold">Analytics</Text>
                </Flex>
              </Box>
            </Flex>
          </Container>
          <Box
            sx={{
              minWidth: '349px',
              display: formStep === 0 ? 'block' : 'none',
            }}>
            <Box sx={{ p: '24px' }}>
              <FormFieldDroppable items={items} setItems={setItems} />
            </Box>
          </Box>
        </Flex>
      </Page>
    </>
  );
};

export default Index;
