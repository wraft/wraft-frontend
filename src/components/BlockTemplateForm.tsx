import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text, Spinner } from 'theme-ui';

import { useForm } from 'react-hook-form';

import Field from './Field';
import FieldText from './FieldText';
// import { BlockTemplates } from '../utils/types';
// import styled from 'styled-components';
import EditorWraft from './EditorWraft';
import { createEntity, updateEntity } from '../utils/models';
import Router, { useRouter } from 'next/router';
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

// interface IFormTemplate {
//   name?: string;
//   serialized?: any;
// }

// const dummyFormTemplate: IFormTemplate = {};

const EMPTY_MARKDOWN_NODE = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Write here',
        },
      ],
    },
  ],
};

const Form = () => {
  const token = useStoreState(state => state.auth.token);
  const { register, handleSubmit, errors, setValue } = useForm();
  // const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  // const [varias, setVarias] = useState<IContentType>();
  // const [dataTemplate, setDataTemplate] = useState<BlockTemplates>();
  // const [body, setBody] = useState('');
  // const [formData, setFormData] = useState<IFormTemplate>(dummyFormTemplate);
  // const [keys, setKeys] = useState<Array<string>>();
  // const [raw, setRaw] = useState<any>();
  const [def, setDef] = useState<any>();
  // const [insertable, setInsertable] = useState<any>();
  // const [status, setStatus] = useState<number>(0);
  // const [cleanInsert, setCleanInsert] = useState<Boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  /**
   * Form Submit
   * @param data
   */

   const onSuccess = (data: any) => {
    setLoading(false);
    console.log('data', data);
    if (data?.id) {
      Router.push(`/block_templates`);
    }
   }

  const onSubmit = (data: any) => {
    console.log('data', data);

    setLoading(true);

    const formValues = {
      title: data.title,
      body: data.body,
      serialized: data.serialized,
    };

    // if edit is live
    if (cId) {
      updateEntity(`block_templates/${cId}`, formValues, token);
    } else {
      console.log('formValues', formValues);
      createEntity(formValues, `block_templates`, token, onSuccess);
    }
  };

  /**
   * Load Content Type Details
   * @param id
   */
  // const loadTemplate = (id: string, token: string) => {
  //   loadEntityDetail(token, 'block_templates', id, loadTemplateSuccess);
  // };

  // const loadTemplateSuccess = (data: BlockTemplates) => {
  //   setDataTemplate(data);
  // };

  const doUpdate = (state: any) => {
    console.log('state', state);
    // turn OFF appending blocks
    // setCleanInsert(false);

    // console.debug('state', state);

    // setBody(state);

    // if (state.serialized) {
    //   setStatus(1);
    //   setRaw(state.serialized);
    // }

    if (state.md) {
      setValue('body', state.md);
      setValue('serialized', state.serialized);
    }
  };

  // const xdoUpdate = (data: any) => {
  //   console.debug('data', data);
  //   // if (data.md) {
  //   //   setValue('body', data.md);
  //   // }

  //   if (data.serialized) {
  //     setValue('serialized', data.serialized);
  //   }

  //   // if (data && data.content) {
  //   //   setValue('data', data.content);
  //   // }
  // };

  useEffect(() => {
    setDef(EMPTY_MARKDOWN_NODE);
  }, [token]);

  // useEffect(() => {
  //   if (token && cId) {
  //     loadTemplate(cId, token);
  //   }
  // }, [token, cId]);

  // useEffect(() => {
  //   if (dataTemplate) {
  //     setValue('title', dataTemplate.title);
  //     setBody(dataTemplate.body);
  //   }
  // }, [dataTemplate]);

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py={3}
      mt={4}
      mx={4}
      mb={3}
      variant="w100">
      <Box>
        <Text mb={3} variant="pagetitle">
          Create Block
        </Text>
      </Box>
      <Box variant="w50">
        <Flex>
          <Box variant="w100">
            <Field
              name="title"
              label="Name"
              defaultValue=""
              register={register}
            />
            <Box variant="hidden">
              <Field
                name="body"
                label="Body"
                defaultValue={''}
                register={register}
              />
            </Box>
            <Box variant="hidden">
              <FieldText
                name="serialized"
                label="Serialized"
                defaultValue={'{}'}
                register={register}
              />
            </Box>
            {/* <EditorWraft autoFocus defaultValue="Heading"/> */}
            <EditorWraft
              onUpdate={doUpdate}
              initialValue={def}
              // editor="wysiwyg"
              mt={4}
              // value={body}
              editable={true}
            />
            {/* <Box pt={2} mb={3}>
              <Label sx={{ mb: 0, pb: 1 }}>Block Content</Label>
              <EditorWraft
                editable={true}
                onUpdate={doUpdate}
                value={body}
                editor="wysiwyg"
                mt={1}
                initialValue={EMPTY_MARKDOWN_NODE}
                insertable={false}
              />
            </Box> */}
            {/* {body} */}
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
      </Box>

      <Button variant="primary">
        <Flex>
          {loading && <Spinner color="white" size={24} />}
          {!loading && <Button>{cId ? 'Update' : 'Create'}</Button>}
        </Flex>
      </Button>
      
    </Box>
  );
};
export default Form;
