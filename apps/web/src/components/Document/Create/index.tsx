// import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { Button } from '@wraft/ui';
import { useForm, Controller } from 'react-hook-form';
import { Box, Text, Flex } from 'theme-ui';
import { v4 as uuidv4 } from 'uuid';

import contentStore from '../../../store/content.store';
import { fetchAPI } from '../../../utils/models';
import { Field as FieldT } from '../../../utils/types';
import Field from '../../Field';
import FieldDate from '../../FieldDate';

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

  // const router = useRouter();

  const {
    // formState: { errors },
    register,
    control,
    handleSubmit,
    setValue,
    resetField,
    watch,
  } = useForm<any>({
    mode: 'onSubmit',
  });

  const template = watch('template');
  const lor = contentStore((state: any) => state.variant);
  const setUser = contentStore((state: any) => state.setUser);

  useEffect(() => {
    const uuid = uuidv4();
    setValue('id', uuid);
    loadData();
  }, []);

  useEffect(() => {
    // const { tid, cid } = template;
    if (template?.tid) {
      resetField('content');
      getFields(template?.cid);
    }
  }, [template?.tid]);

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

  const onSubmit = (data: any) => {
    console.log('data', data);
    setUser(data);
    Router.push(`/new?template=${data.id}`);
    console.log('data[lor]', lor);
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

  return (
    <Box bg="gray.0">
      <Box>{loading && <></>}</Box>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 0, borderTop: 'solid 1px', borderColor: 'border' }}>
          <Box
            variant="caps"
            sx={{
              // fontSize: 0,
              bg: 'gray.200',
              py: 1,
              pl: 3,
              color: 'text',
              width: '100%',
              borderBottom: 'solid 1px',
              borderColor: 'border',
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
              render={({ field: { onChange } }) => (
                <>
                  {contents.map((x: any) => (
                    <Box key={x.id}>
                      <BlockItem {...x} onChange={onChange} />
                    </Box>
                  ))}
                </>
              )}
            />
          )}

          {fields && fields.length > 0 && (
            <Box sx={{ pt: 4 }}>
              {fields.map((f: FieldT) => (
                <Box key={f.id} sx={{ pb: 2 }}>
                  {f.field_type.name === 'date' && (
                    <FieldDate
                      name={`content[${f.name}]`}
                      label={f.name}
                      register={register}
                      sub="Date"
                      onChange={() => console.log('x')}
                    />
                  )}

                  {f.field_type.name !== 'date' && (
                    <Field
                      name={`content[${f.name}]`}
                      label={f.name}
                      defaultValue=""
                      register={register}
                    />
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Button onClick={handleSubmit(onSubmit)}>Next</Button>
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
  onChange: any;
}

export const BlockItem = ({
  id,
  title,
  content_type,
  onChange,
}: BlockItemProps) => {
  return (
    // <Link href={`/new?template=${id}&cid=${content_type.id}`}>
    <Flex
      onClick={() => onChange({ tid: id, cid: content_type.id })}
      sx={{
        px: 3,
        py: 2,
        borderBottom: 'solid 1px',
        bg: 'neutral.100',
        borderColor: 'border',
        cursor: 'pointer',
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
