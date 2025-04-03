import { FC, useEffect, useState, useRef as _useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Flex, Text } from '@wraft/ui';
import { Button, Modal } from '@wraft/ui';
import { useForm } from 'react-hook-form';

import FormsFrom from 'components/Form/FormsFrom';
import FormViewForm from 'components/Form/FormViewForm';
import { FormResponseList } from 'components/WraftForm';
import MenuStepsIndicator from 'common/MenuStepsIndicator';
import Page from 'common/PageFrame';
import FieldText from 'common/FieldText';
import Field from 'common/Field';
import PageHeader from 'common/PageHeader';
import { fetchAPI, postAPI as _postAPI } from 'utils/models';
import { usePermission } from 'utils/permissions';

const Index: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [items, setItems] = useState<any>([]);
  const [formdata, setFormdata] = useState<any>();
  const [formStep, setFormStep] = useState<number>(0);
  const [_rerender, setRerender] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { hasPermission } = usePermission();

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

  const saveForm = () => {
    setIsSaving(true);
    setRerender((prev) => !prev);
  };

  useEffect(() => {
    if (cId && cId.length > 0) {
      loadData(cId);
    }
  }, [cId]);

  return (
    <>
      <Head>
        <title>Form Details | Wraft</title>
        <meta name="description" content="form questions and responses" />
      </Head>
      <Page showFull={true}>
        <PageHeader
          title={`${formdata?.name || 'name loading...'}`}
          desc={`${formdata?.description || 'detatils loading...'}`}>
          {hasPermission('form', 'manage') && (
            <Flex alignItems="center" gap="8px" pr={4}>
              <Button
                variant="secondary"
                onClick={() => setIsView((prev) => !prev)}>
                {isView ? 'Edit' : 'Preview'}
              </Button>
              <Box>
                <Button variant="secondary">
                  <a
                    href={`/forms/entry/new/${cId}`}
                    target="_blank"
                    rel="noopener noreferrer">
                    Share
                  </a>
                </Button>
              </Box>
              <Button onClick={saveForm} loading={isSaving}>
                Save
              </Button>
            </Flex>
          )}
        </PageHeader>

        <Flex flex={1} px="md" py="md" gap="md">
          <MenuStepsIndicator
            formStep={formStep}
            goTo={goTo}
            titles={['Questions', 'Responses']}
          />
          <Box w="100%">
            {!isView && formStep === 0 && hasPermission('form', 'manage') && (
              <FormsFrom
                formdata={formdata}
                items={items}
                setItems={setItems}
                setRerender={setRerender}
                isEdit
                setIsOpen={setIsOpen}
                trigger={isSaving}
                setLoading={setIsSaving}
              />
            )}
            {isView && formStep === 0 && (
              <Box
                w="100%"
                maxHeight="calc(100vh - 72px - 72px)"
                maxWidth="80ch"
                overflowY="auto">
                <FormViewForm items={items} />
              </Box>
            )}

            {formStep === 1 && <FormResponseList />}
          </Box>
        </Flex>

        <Modal
          ariaLabel="edit form"
          open={isOpen}
          onClose={() => setIsOpen(false)}>
          <Box as="form" onSubmit={handleSubmit(onSubmit)} minWidth="518px">
            <Box p={4} borderBottom="1px solid" borderColor="border">
              <Text as="p" variant="xl">
                Edit form
              </Text>
            </Box>
            <Box p={4}>
              <Field
                name="name"
                label="Name"
                placeholder="Name"
                defaultValue={formdata?.name}
                register={register}
                error={errors.name}
                mb={3}
              />
              <Field
                name="prefix"
                label="Prefix"
                placeholder="PREFIX"
                defaultValue={formdata?.prefix}
                register={register}
                error={errors.prefix}
                mb={3}
              />
              <FieldText
                name="description"
                label="Description"
                defaultValue={formdata?.description}
                register={register}
                error={errors.description}
              />
            </Box>
            <Flex p={4} pt={0} gap={3}>
              <Button
                type="submit"
                variant="primary"
                onClick={() => handleSubmit(onSubmit)}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </Flex>
          </Box>
        </Modal>
      </Page>
    </>
  );
};

export default Index;
