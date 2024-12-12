import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Pagination, Skeleton } from '@wraft/ui';
import { useForm, Controller } from 'react-hook-form';
import { Box, Text, Flex } from 'theme-ui';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
// import { steps } from 'framer-motion';

import FieldDate from 'components/FieldDate';
import { EmptyForm } from 'components/Icons';
import Field from 'common/Field';
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

const CreateDocument = () => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [pageMeta, setPageMeta] = useState<any>();

  const [loading, setLoading] = useState<boolean>(true);
  const [fields, setField] = useState([]);
  const [formStep, setFormStep] = useState(0);

  const router = useRouter();

  const {
    // formState: { errors },
    register,
    control,
    handleSubmit,
    setValue,
    resetField,
    watch,
    getValues,
  } = useForm<any>({
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
      setNewContent(data);
      router.push(`/content/new`);
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
          sx={{
            p: '32px',
            borderTop: 'solid 1px',
            borderColor: 'border',
            height: 'calc(100vh - 220px)',
            overflowY: 'scroll',
          }}>
          {formStep === 0 && (
            <>
              <Box
                variant="caps"
                sx={{
                  fontSize: 'xxs',
                  py: 2,
                  color: 'text',
                }}>
                <Text as="h4" sx={{ fontSize: 'sm', fontWeight: 'heading' }}>
                  Select a template
                </Text>
              </Box>

              {!loading && contents.length < 1 && (
                <Flex sx={{ alignItems: 'center' }}>
                  <Box sx={{ color: 'gray.500' }}>
                    <EmptyForm />
                  </Box>
                  <Box sx={{ m: 2, pb: 0 }}>
                    <Text as="h3" sx={{ fontWeight: 200, color: 'text' }}>
                      No template has been created yet.
                    </Text>
                  </Box>
                </Flex>
              )}

              {loading &&
                Array.from({ length: 10 }, (_, index) => (
                  <Flex
                    key={index}
                    sx={{
                      px: 3,
                      py: 2,
                      border: 'solid 1px',
                      borderBottom: 'none',
                      borderColor: 'border',
                    }}>
                    <Box>
                      <Skeleton width="20px" height="22px" />
                    </Box>
                    <Box mx={3} sx={{ width: '100%' }}>
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
                <Box sx={{ pt: 4 }}>
                  {fields.map((f: FieldT) => (
                    <Box key={f.id} sx={{ pb: 2 }}>
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
                          name={`contentFields[${convertToVariableName(f.name)}]`}
                          label={capitalizeFirst(f.name)}
                          defaultValue=""
                          register={register}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
        <Flex p="32px" sx={{ gap: 2 }}>
          <Button
            variant="ghost"
            disabled={formStep === 0}
            onClick={() => setFormStep((pre) => pre - 1)}>
            Back
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
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

export const BlockItem = ({ template, onChange, selected }: any) => {
  const { id, title, content_type }: BlockItemProps = template;

  return (
    // <Link href={`/new?template=${id}&cid=${content_type.id}`}>
    <Flex
      onClick={() => onChange(template)}
      sx={{
        px: 3,
        py: 2,
        border: 'solid 1px',
        borderBottom: 'none',
        borderColor: 'border',
        cursor: 'pointer',
        bg: selected.id === id && 'green.300',

        '&:last-child': {
          borderBottom: 'solid 1px',
          borderColor: 'border',
        },

        '&:hover': { bg: 'green.200' },
      }}>
      <Box
        sx={{
          width: '16px',
          borderRadius: 4,
          mr: 2,
          mt: 1,
          borderColor: 'border',
          height: '16px',
          bg: content_type.color,
        }}
      />
      <Box>{title}</Box>
      <Text
        as="h4"
        sx={{
          fontSize: 'xxs',
          m: 0,
          ml: 'auto',
          color: 'text',
          fontWeight: 300,
        }}>
        {content_type.prefix}
      </Text>
    </Flex>
    // </Link>
  );
};
