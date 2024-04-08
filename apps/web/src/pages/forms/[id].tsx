import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Flex, Text } from 'theme-ui';

import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';
import PageHeader from 'components/PageHeader';
import FormFieldDroppable from 'components/FormFieldDroppable';
import MenuStepsIndicator from 'components/MenuStepsIndicator';
import { fetchAPI } from 'utils/models';

const Index: FC = () => {
  const [items, setItems] = useState<any>([]);
  const [initial, setInitial] = useState<any>([]);
  const [form, setForm] = useState<any>();
  const [formStep, setFormStep] = useState<number>(0);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const router = useRouter();
  const cId: string = router.query.id as string;

  const loadData = (id: string) => {
    fetchAPI(`forms/${id}`).then((data: any) => {
      console.log(data);
      setForm(data);
      const fileds = data.fields.map((i: any) => {
        return {
          id: i.id,
          name: i.name,
          type: i.field_type.name,
          required: i.validations.some(
            (val: any) =>
              val.validation.rule === 'required' &&
              val.validation.value === true,
          ),
          long: false,
        };
      });
      setInitial(fileds);
      setItems(fileds);
    });
  };

  const goTo = (step: number) => {
    setFormStep(step);
  };

  useEffect(() => {
    if (cId && cId.length > 0) {
      loadData(cId);
      setIsEdit(true);
    }
  }, [cId]);

  useEffect(() => {
    console.log('initial:', initial);
  }, [initial]);
  return (
    <>
      <Head>
        <title>Create Collection Form - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        <PageHeader
          title={`${form?.name || 'name loading...'}`}
          desc={`${form?.description || 'detatils loading...'}`}
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
