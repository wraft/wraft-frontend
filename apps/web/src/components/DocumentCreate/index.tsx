import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Pagination,
  Skeleton,
  Box,
  Text,
  Flex,
  InputText,
  Field,
} from '@wraft/ui';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import styled from '@emotion/styled';
// import { steps } from 'framer-motion';
import { EmptyFormIcon } from '@wraft/icon';

import FieldDate from 'common/FieldDate';
import StepsIndicator from 'common/Form/StepsIndicator';
import { capitalizeFirst, convertToVariableName } from 'utils/index';
import { fetchAPI } from 'utils/models';
import { Field as FieldT } from 'utils/types';
import contentStore from 'store/content.store';

export interface ILayout {
  width: number;
  updated_at: string;
  unit: string;
  slug: string;
  name: string;
  id: string;
  height: number;
  description: string;
}

export interface IField {
  id: string;
  name: string;
  layout_id: string;
  layout: ILayout;
  description: string;
}

export interface IFieldItem {
  name: string;
  type: string;
}

type FormValues = {
  contentFields: any;
  id?: string;
  template?: any;
};

const CreateDocument = () => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<any>();

  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [fields, setField] = useState([]);
  const [formStep, setFormStep] = useState(0);

  const router = useRouter();

  const {
    formState: { errors },
    register,
    control,
    handleSubmit,
    setValue,
    resetField,
    watch,
    getValues,
  } = useForm<FormValues>({
    mode: 'onSubmit',
  });

  const template = watch('template');
  const setNewContent = contentStore((state) => state.addNewContent);

  useEffect(() => {
    const uuid = uuidv4();
    setValue('id', uuid);
    loadData();
  }, []);

  useEffect(() => {
    if (template?.id) {
      resetField('contentFields');
      getFields(template?.content_type.id);
    }
  }, [template?.id]);

  const loadData = (page = 1) => {
    fetchAPI(`data_templates?page=${page}&sort=updated_at_desc`)
      .then((data: any) => {
        setLoading(false);
        const res: IField[] = data.data_templates;
        setContents(res);
        setPageMeta(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const onSubmit = (data: any) => {
    if (formStep === 0 && !template) {
      toast.error('Please select a template.', {
        duration: 3000,
        position: 'top-right',
      });
      return;
    }
    if (formStep === 0) {
      setFormStep(1);
    }
    if (formStep === 1) {
      setIsSubmiting(true);
      setNewContent(data);
      router.push(`/documents/new`);
    }
  };

  const getFields = (cid: string) => {
    fetchAPI(`content_types/${cid}`).then((data: any) => {
      const res: any = data;

      const tFields = res?.content_type?.fields;
      if (tFields) {
        setField(tFields);
      }
    });
  };

  const changePage = (newPage: any) => {
    loadData(newPage);
    setLoading(true);
  };

  const vals = getValues();

  return (
    <Box bg="gray.0">
      <Box>{loading && <></>}</Box>
      <StepsIndicator
        titles={['Choose a template', 'Add content']}
        formStep={formStep}
        goTo={goTo}
      />
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Box
          p="xl"
          borderTop="solid 1px"
          borderColor="border"
          h="calc(100vh - 220px)"
          overflowY="scroll">
          {formStep === 0 && (
            <>
              <Box mb="sm">
                <Text as="h4">Select a template</Text>
              </Box>

              {!loading && contents.length < 1 && (
                <Flex alignItems="center">
                  <Box color="gray.500">
                    <EmptyFormIcon />
                  </Box>
                  <Box m={2} pb={0}>
                    <Text as="h3">No template has been created yet.</Text>
                  </Box>
                </Flex>
              )}

              {loading &&
                Array.from({ length: 10 }, (_, index) => (
                  <Flex
                    key={index}
                    px="md"
                    py="md"
                    border="solid 1px"
                    borderBottom="none"
                    borderColor="border">
                    <Box>
                      <Skeleton width="20px" height="22px" />
                    </Box>
                    <Box mx={3} w="100%">
                      <Skeleton height="22px" />
                    </Box>
                    <Skeleton width="20px" height="22px" />
                  </Flex>
                ))}

              {!loading && contents && (
                <Controller
                  control={control}
                  defaultValue=""
                  name="template"
                  // rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <>
                      {contents.map((x: any) => (
                        <BlockItem
                          key={x.id}
                          template={x}
                          selected={value}
                          onChange={onChange}
                        />
                      ))}
                    </>
                  )}
                />
              )}
              <Box mt="16px">
                {pageMeta && pageMeta?.total_pages > 1 && (
                  <Pagination
                    type="simple"
                    totalPage={pageMeta?.total_pages}
                    initialPage={1}
                    onPageChange={changePage}
                    totalEntries={pageMeta?.total_entries}
                  />
                )}
              </Box>
            </>
          )}
          {formStep === 1 && (
            <>
              {fields && fields.length > 0 && (
                <Box pt="sm">
                  {fields.map((f: FieldT) => (
                    <Box key={f.id} pb="sm">
                      {f.field_type.name === 'date' && (
                        <FieldDate
                          name={`contentFields[${convertToVariableName(f.name)}]`}
                          label={capitalizeFirst(f.name)}
                          register={register}
                          sub="Date"
                          onChange={() => console.log('x')}
                        />
                      )}

                      {f.field_type.name !== 'date' && (
                        <Field
                          label={capitalizeFirst(f.name)}
                          required
                          error={
                            //@ts-expect-error Dynamic key access
                            errors?.contentFields?.[
                              convertToVariableName(f.name)
                            ]?.message || ''
                          }>
                          <InputText
                            placeholder={`Enter your ${f.name} `}
                            {...register(
                              `contentFields.${convertToVariableName(f.name)}`,
                              {
                                required: {
                                  value: true,
                                  message: `${capitalizeFirst(f.name)} is required`,
                                },
                              },
                            )}
                          />
                        </Field>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
        <Flex p="32px" gap="sm">
          <Button
            variant="ghost"
            disabled={formStep === 0}
            onClick={() => setFormStep((pre) => pre - 1)}>
            Back
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={isSubmiting}
            disabled={
              vals === undefined ||
              vals === null ||
              (vals && vals.template === '')
            }>
            {formStep === 1 ? 'Create' : 'Next'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
export default CreateDocument;

interface BlockItemProps {
  title: string;
  content_type: any;
  color: string;
  prefix: string;
  id: string;
}

const BlockItemWrapper = styled(Flex)`
  &:last-child {
    border-bottom: solid 1px;
    border-color: border;
  }

  &:hover {
    background: ${({ theme }: any) => theme.colors.green['200']};
  }
`;

export const BlockItem = ({ template, onChange, selected }: any) => {
  const { id, title, content_type }: BlockItemProps = template;

  return (
    <BlockItemWrapper
      onClick={() => onChange(template)}
      px="sm"
      py="sm"
      gap="sm"
      border="solid 1px"
      borderBottom="none"
      borderColor="border"
      cursor="pointer"
      align="center"
      bg={selected.id === id && 'green.300'}>
      <Box
        w="12px"
        h="12px"
        borderRadius="sm"
        borderColor="border"
        bg={content_type.color}
      />
      <Text>{title}</Text>
      <Text fontSize="sm" fontWeight="heading">
        {content_type.prefix}
      </Text>
    </BlockItemWrapper>
  );
};
