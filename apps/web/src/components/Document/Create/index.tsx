import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { Button } from '@wraft/ui';
import { useForm, Controller } from 'react-hook-form';
import { Box, Text, Flex } from 'theme-ui';
import { v4 as uuidv4 } from 'uuid';
import StepsIndicator from '@wraft-ui/Form/StepsIndicator';
// import { steps } from 'framer-motion';

import Field from 'components/Field';
import FieldDate from 'components/FieldDate';
import { capitalizeFirst } from 'utils/index';
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

// interface ContentTypeList {
//   isEdit?: boolean;
// }

const CreateDocument = () => {
  const [contents, setContents] = useState<Array<IField>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fields, setField] = useState([]);
  const [formStep, setFormStep] = useState(0);

  // const router = useRouter();

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
  console.log('template', template);
  const setNewContent = contentStore((state) => state.addNewContent);

  useEffect(() => {
    const uuid = uuidv4();
    setValue('id', uuid);
    loadData();
  }, []);

  useEffect(() => {
    // const { tid, cid } = template;
    if (template?.id) {
      resetField('contentFields');
      getFields(template?.content_type.id);
    }
  }, [template?.id]);

  const loadData = () => {
    fetchAPI(`data_templates`)
      .then((data: any) => {
        setLoading(true);
        const res: IField[] = data.data_templates;
        setContents(res);
      })
      .catch(() => {
        setLoading(true);
      });
  };

  const goTo = (step: number) => {
    setFormStep(step);
  };

  const onSubmit = (data: any) => {
    if (formStep === 0) {
      setFormStep(1);
    }
    if (formStep === 1) {
      console.log('data', data);
      setNewContent(data);
      Router.push(`/content/new`);
      console.log('data[lor]', data);
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
    // loadTemplates(tid);
    // //temp
    // setActiveTemplate(tid);
    // setShowForm(true);
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
            height: 'calc(100vh - 180px)',
            overflowX: 'scroll',
          }}>
          {formStep === 0 && (
            <>
              <Box
                variant="caps"
                sx={{
                  fontSize: 0,
                  py: 2,
                  color: 'text',
                }}>
                <Text as="h4" sx={{ fontSize: 2, fontWeight: 'heading' }}>
                  Select a template
                </Text>
              </Box>

              {contents && (
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
                          name={`contentFields[${f.name}]`}
                          label={capitalizeFirst(f.name)}
                          register={register}
                          sub="Date"
                          onChange={() => console.log('x')}
                        />
                      )}

                      {f.field_type.name !== 'date' && (
                        <Field
                          name={`contentFields[${f.name}]`}
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
        <Flex px="32px" sx={{ gap: 2 }}>
          <Button
            disabled={formStep === 0}
            onClick={() => setFormStep((pre) => pre - 1)}>
            Prev
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={
              vals === (undefined || null) || (vals && vals.template === '')
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
        bg: selected.id === id && 'gray.200',

        '&:last-child': {
          borderBottom: 'solid 1px',
          borderColor: 'border',
        },

        '&:hover': { bg: 'neutral.200' },
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
          fontSize: 0,
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
