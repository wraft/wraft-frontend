import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { Box, Text, Flex } from 'theme-ui';

import { fetchAPI } from '../../utils/models';

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

  const { control, handleSubmit } = useForm<any>({
    mode: 'onSubmit',
  });

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

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = (data: any) => {
    console.log('data', data);
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
              name="variant"
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
        </Box>
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
    <Link href={`/new?template=${id}&cid=${content_type.id}`}>
      <Flex
        onClick={() => onChange(id)}
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
    </Link>
  );
};
