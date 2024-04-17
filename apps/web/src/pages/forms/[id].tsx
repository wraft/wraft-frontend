import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Container, Flex, Input, Label, Text, Textarea } from 'theme-ui';
import { Button } from '@wraft/ui';
import { EditIcon } from '@wraft/icon';
import { useForm } from 'react-hook-form';

import Page from 'components/PageFrame';
import FormsFrom from 'components/FormsFrom';
import PageHeader from 'components/PageHeader';
import FormFieldDroppable from 'components/FormFieldDroppable';
import MenuStepsIndicator from 'components/MenuStepsIndicator';
import Modal from 'components/Modal';
import Field from 'components/Field';
import FieldText from 'components/FieldText';
import { TimeAgo } from 'components/Atoms';
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
      console.log(data);
      setFormdata(data);
      const fileds = data.fields.map((i: any) => {
        return {
          id: i.id,
          name: i.name,
          type: i.field_type.name,
          fieldTypeId: i.field_type.id,
          required: i.validations.some(
            (val: any) =>
              val.validation.rule === 'required' &&
              val.validation.value === true,
          ),
        };
      });
      setInitial(fileds);
      setItems(fileds);
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
            <Button variant="secondary">Save</Button>
          </Flex>
        </Flex>
        <Flex sx={{ display: isView ? 'block' : 'none' }}>
          <Container variant="layout.pageFrame">
            <Flex sx={{ justifyContent: 'center' }}>
              <Box
                sx={{
                  bg: 'white',
                  width: '100%',
                  maxHeight: 'calc(100vh - 72px - 72px)',
                  maxWidth: '80ch',
                  overflowY: 'auto',
                }}>
                {items.map((item: any) => {
                  <Box
                    key={item.id}
                    sx={{
                      p: 4,
                      borderBottom: '1px solid',
                      borderColor: 'border',
                    }}>
                    <Label>
                      {item.name}
                      <Text sx={{ color: 'red.700' }}>
                        {item.required && '*'}
                      </Text>
                    </Label>
                    {items.type === 'Text' && <Textarea />}
                    <Input mb={3} />
                  </Box>;
                })}
              </Box>
            </Flex>
          </Container>
        </Flex>
        <Flex sx={{ display: isView ? 'none' : 'block' }}>
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
                <FormsFrom
                  formdata={formdata}
                  items={items}
                  setItems={setItems}
                  setRerender={setRerender}
                  isEdit
                />
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
              <Flex sx={{ mb: 3 }}>
                <Button
                  variant="none"
                  onClick={() => {
                    setIsOpen(true);
                  }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {' '}
                    <Text as="p" variant="pM" sx={{ color: 'gray.600' }}>
                      {formdata?.name || 'name...'}
                    </Text>
                    <EditIcon width={16} />
                  </Box>
                </Button>
              </Flex>
              <Box
                sx={{
                  p: '24px',
                  bg: 'green.100',
                  mb: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}>
                <Box />
                {formdata?.updated_at && <TimeAgo time={formdata.updated_at} />}
              </Box>
              <Label>{items.length} Fields</Label>
              <FormFieldDroppable items={items} setItems={setItems} />
            </Box>
          </Box>
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
