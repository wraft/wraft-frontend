import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from 'rebass';

import { useForm } from 'react-hook-form';

import Field from './Field';
import FieldText from './FieldText';
import { BlockTemplates } from '../utils/types';
// import styled from 'styled-components';
import EditorWraft from './EditorWraft';
import { loadEntityDetail, createEntity, updateEntity } from '../utils/models';
import { useRouter } from 'next/router';
import { useStoreState } from 'easy-peasy';

// const Tag = styled(Box)`
//   padding: 5px;
//   color: #444;
//   border-radius: 3px;
//   margin-bottom: 8px;
//   padding-left: 16px;
//   padding-top: 8px;
//   padding-bottom: 8px;
//   background-color: #d7f7e2;
//   max-width: 60%;
//   font-family: monospace;
//   font-weight: bold;
//   color: #3d5039;
// `;

const Form = () => {
  const token = useStoreState(state => state.auth.token);
  const { register, handleSubmit, errors, setValue } = useForm();
  // const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  // const [varias, setVarias] = useState<IContentType>();
  const [dataTemplate, setDataTemplate] = useState<BlockTemplates>();
  const [body, setBody] = useState('');
  // const [keys, setKeys] = useState<Array<string>>();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  // const EMPTY_MARKDOWN_NODE = {
  //   type: 'doc',
  //   content: [
  //     {
  //       type: 'paragraph',
  //       content: [
  //         {
  //           type: 'text',
  //           text: 'Write here',
  //         },
  //       ],
  //     },
  //   ],
  // };

  /**
   * Form Submit
   * @param data
   */
  const onSubmit = (data: any) => {
    const formValues = {
      title: data.title,
      body: data.body,
      serialised: data.serialized,
    };

    // if edit is live
    if (cId) {
      updateEntity(`block_templates/${cId}`, formValues, token);
    } else {
      createEntity(formValues, `block_templates`, token);
    }
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadTemplate = (id: string, token: string) => {
    loadEntityDetail(token, 'block_templates', id, loadTemplateSuccess);
  };

  const loadTemplateSuccess = (data: BlockTemplates) => {
    setDataTemplate(data);
  };

  // const doUpdate = (data: any) => {
  //   console.log('data', data);

  //   if (data.md) {
  //     setValue('body', data.md);
  //   }

  //   if (data.serialized) {
  //     setValue('serialized', data.serialized);
  //   }

  //   if (data && data.content) {
  //     setValue('data', data.content);
  //   }
  // };

  useEffect(() => {}, [token]);

  useEffect(() => {
    if (token && cId) {
      loadTemplate(cId, token);
    }
  }, [token, cId]);

  useEffect(() => {
    if (dataTemplate) {
      setValue('title', dataTemplate.title);
      setBody(dataTemplate.body);
    }
  }, [dataTemplate]);

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} py={3} width={1} mt={4}>
      <Box pl={4}>
        <Text mb={3} fontSize={2} fontWeight={500}>
          Create Template
        </Text>
      </Box>
      <Box mx={4} mb={3} width={1}>
        <Flex>
          <Box width={7 / 12} mr={2}>
            <Field
              name="title"
              label="Name"
              defaultValue=""
              register={register}
            />
            <Box sx={{ display: 'none' }}>
              <FieldText
                name="body"
                label="Text Template"
                defaultValue={''}
                register={register}
              />
            </Box>
            <Box sx={{ display: 'none' }}>
              <FieldText
                name="serialized"
                label="Text Template"
                defaultValue={''}
                register={register}
              />
            </Box>
            <EditorWraft
              // onUpdate={doUpdate}
              // initialValue={EMPTY_MARKDOWN_NODE}
              // editor="wysiwyg"
              // value={body}
              // editable={true}
            />
            {body}
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
      </Box>
      <Button ml={2}>{cId ? 'Update' : 'Create'}</Button>
    </Box>
  );
};
export default Form;
