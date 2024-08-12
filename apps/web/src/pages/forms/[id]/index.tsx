import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Flex, Text } from 'theme-ui';
import { Button } from '@wraft/ui';
import { useForm } from 'react-hook-form';

import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';
import PageHeader from 'components/PageHeader';
import MenuStepsIndicator from 'components/MenuStepsIndicator';
import Modal from 'components/Modal';
import Field from 'components/Field';
import FieldText from 'components/FieldText';
import FormViewForm from 'components/FormViewForm';
import { FormResponseList } from 'components/WraftForm';
import { fetchAPI } from 'utils/models';

const Index: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [items, setItems] = useState<any>([]);
  const [initial, setInitial] = useState<any>([]);
  const [formdata, setFormdata] = useState<any>();
  const [formStep, setFormStep] = useState<number>(0);
  const [rerender, setRerender] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);

  const router = useRouter();
  const cId: string = router.query.id as string;

  const loadData = (id: string) => {
    fetchAPI(`forms/${id}`).then((data: any) => {
      setFormdata(data);
      const fileds = data.fields.map((i: any) => {
        return {
          id: i.id,
          name: i.name,
          type: i.field_type.name,
          fieldTypeId: i.field_type.id,
          order: i.order,
          required: i.validations.some(
            (val: any) =>
              val.validation.rule === 'required' &&
              val.validation.value === true,
          ),
        };
      });
      setInitial(fileds);
      const sortedFields = fileds
        .slice()
        .sort((a: any, b: any) => a.order - b.order);
      setItems(sortedFields);
    });
  };

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const onSubmit = (data: any) => {
    setFormdata((prev: any) => ({
      ...prev,
      name: data.name,
      description: data.description,
      prefix: data.prefix,
    }));
  };

  useEffect(() => {
    if (cId && cId.length > 0) {
      loadData(cId);
    }
  }, [cId, rerender]);

  return (
    <>
      <Head>
        <title>Create Collection Form - Wraft Docs</title>
        <meta name="description" content="a nextjs starter boilerplate" />
      </Head>
      <Page id="Modal" showFull={true}>
        {' '}
        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <PageHeader
            title={`${formdata?.name || 'name loading...'}`}
            desc={`${formdata?.description || 'detatils loading...'}`}
          />
          <Flex sx={{ alignItems: 'center', gap: '8px', pr: 4 }}>
            <Button
              variant="secondary"
              onClick={() => setIsView((prev) => !prev)}>
              {isView ? 'Edit' : 'View'}
            </Button>
            <Box>
              <Button variant="secondary">
                <a
                  href={`/forms/entry/${cId}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  Share
                </a>
              </Button>
            </Box>
            {/* <Button variant="secondary">Save</Button> */}
          </Flex>
        </Flex>
        <Box sx={{ display: isView ? 'block' : 'none' }}>
          <Container variant="layout.pageFrame">
            <Flex sx={{ justifyContent: 'center', width: '100%' }}>
              <Box
                sx={{
                  bg: 'white',
                  width: '100%',
                  maxHeight: 'calc(100vh - 72px - 72px)',
                  maxWidth: '80ch',
                  overflowY: 'auto',
                }}>
                <FormViewForm items={items} />
              </Box>
            </Flex>
          </Container>
        </Box>
        <Flex sx={{ display: isView ? 'none' : 'flex' }}>
          <Container variant="layout.pageFrame">
            <Flex>
              <MenuStepsIndicator
                formStep={formStep}
                goTo={goTo}
                titles={['Questions', 'Responses']}
              />
              {formStep === 0 && (
                <FormsFrom
                  formdata={formdata}
                  items={items}
                  setItems={setItems}
                  setRerender={setRerender}
                  isEdit
                  setIsOpen={setIsOpen}
                />
              )}
              {formStep === 1 && (
                <Box
                  sx={{
                    width: '100%',
                  }}>
                  <FormResponseList />
                </Box>
              )}
            </Flex>
          </Container>
        </Flex>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          {isOpen && (
            <Box
              as="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ minWidth: '518px' }}>
              <Box
                sx={{ p: 4, borderBottom: '1px solid', borderColor: 'border' }}>
                <Text as="p" variant="h4Medium">
                  Edit form
                </Text>
              </Box>
              <Box sx={{ p: 4 }}>
                <Field
                  name="name"
                  label="Name"
                  placeholder="Name"
                  defaultValue={formdata.name}
                  register={register}
                  error={errors.name}
                  mb={3}
                />
                <Field
                  name="prefix"
                  label="Prefix"
                  placeholder="PREFIX"
                  defaultValue={formdata.prefix}
                  register={register}
                  error={errors.prefix}
                  mb={3}
                />
                <FieldText
                  name="description"
                  label="Description"
                  defaultValue={formdata.description}
                  register={register}
                  error={errors.description}
                />
              </Box>
              <Flex sx={{ p: 4, pt: 0, gap: 3 }}>
                <Button
                  type="submit"
                  variant="primary"
                  onClick={() => {
                    handleSubmit(onSubmit)();
                    setIsOpen(false);
                  }}>
                  Save
                </Button>
                <Button
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                  }}>
                  Cancel
                </Button>
              </Flex>
            </Box>
          )}
        </Modal>
      </Page>
    </>
  );
};

export default Index;
