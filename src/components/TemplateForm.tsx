import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text } from 'rebass';
import { useForm } from 'react-hook-form';

import Field from './Field';
import FieldText from './FieldText';
import {
  IContentType,
  ContentTypes,
  Field as FieldT,
  DataTemplate,
  DataTemplates,
} from '../utils/types';

import { Label, Select } from '@rebass/forms';
import styled from 'styled-components';
// import {EditorWraft} from './EditorWraft';
import {
  loadEntity,
  loadEntityDetail,
  createEntity,
  updateEntity,
} from '../utils/models';
import { useRouter } from 'next/router';
import { useStoreState } from 'easy-peasy';

import { MarkdownEditor } from './WraftEditor';

const Tag = styled(Box)`
  padding: 5px;
  color: #444;
  border-radius: 3px;
  margin-bottom: 8px;
  padding-left: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  background-color: #d7f7e2;
  max-width: 60%;
  font-family: monospace;
  font-weight: bold;
  color: #3d5039;
`;

export interface BlockTemplate {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

const Form = () => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const token = useStoreState(state => state.auth.token);
  const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  const [varias, setVarias] = useState<IContentType>();
  const [dataTemplate, setDataTemplate] = useState<DataTemplates>();
  const [blocks, setBlocks] = useState<Array<BlockTemplate>>([]);
  const [body, setBody] = useState('');
  // const [keys, setKeys] = useState<Array<string>>();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

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

  /**
   * Form Submit
   * @param data
   */
  const onSubmit = (data: any) => {
    console.log('data', data);

    const formValues = {
      title_template: data.title_template,
      title: data.title,
      data: data.data,
      serialized: {
        data: data.serialized,
      },
    };

    // if edit is live
    if (cId) {
      updateEntity(`data_templates/${cId}`, formValues, token);
    } else {
      createEntity(
        formValues,
        `content_types/${data.parent}/data_templates`,
        token,
      );
    }
  };

  const loadTypesSuccess = (data: any) => {
    const res: IContentType[] = data.content_types;
    setContentTypes(res);
  };

  const loadTypes = () => {
    loadEntity(token, 'content_types', loadTypesSuccess);
  };

  const loadContentTypeSuccess = (data: any) => {
    const formed: ContentTypes = data;
    setVarias(formed.content_type);
    dataFiller(formed.content_type.fields || {});
    console.log('Loaded Content Type:', formed);
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadContentType = (id: string) => {
    loadEntityDetail(token, 'content_types', id, loadContentTypeSuccess);
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadBlocks = () => {
    loadEntity(token, 'block_templates', loadBlocksSuccess);
  };

  const loadBlocksSuccess = (data: any) => {
    const allBlocks: BlockTemplate[] = data.block_templates;
    setBlocks(allBlocks);
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadTemplate = (id: string, token: string) => {
    loadEntityDetail(token, 'data_templates', id, loadTemplateSuccess);
  };

  const loadTemplateSuccess = (data: DataTemplates) => {
    let insert =
      (data.data_template &&
        data.data_template.serialized &&
        data.data_template.serialized.data) ||
      false;

    if (insert) {
      const mm = JSON.parse(insert);
      console.log('has serials', mm);
      // setInsertable(mm);
    }
    setDataTemplate(data);
  };

  const dataFiller = (entries: any) => {
    const keys = Object.entries(entries);
    const k: any = keys;
    return k;
  };

  /**
   * When Content Type is Changed
   * - Load Available fields here.
   * @param event
   */

  const ctypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
    const safeSearchTypeValue: string = event.currentTarget.value;
    loadContentType(safeSearchTypeValue);
  };

  /**
   * When Editor is updated
   * @param data 
   */
  const doUpdate = (data: any) => {
    if (data.md) {
      setValue('body', data.md);
      setValue('data', data.md);
    }

    if (data.serialized) {
      setValue('serialized', data.serialized);
    }
    // console.log('data', data);
    // setValue('body', data);
    if (data && data.content) {
      setValue('data', data.content);
    }
  };

  useEffect(() => {
    setBody('Loading ...');
    if (token) {
      loadTypes();
      loadBlocks();
    }
  }, [token]);

  useEffect(() => {
    // find the first element
    if (ctypes && ctypes[0] && ctypes[0].id) {
      loadContentType(ctypes[0].id);
    }
  }, [ctypes]);

  useEffect(() => {
    if (token && cId) {
      loadTemplate(cId, token);
    }
  }, [token, cId]);

  /**
   * On Template Load
   */
  useEffect(() => {
    if (dataTemplate && dataTemplate.data_template) {
      const d: DataTemplate = dataTemplate.data_template;
      setValue('title', d.title);
      setValue('title_template', d.title_template);
      setValue('parent', dataTemplate.content_type.id);

      loadContentType(dataTemplate.content_type.id);

      //
      let insert = (d && d.serialized && d.serialized.data) || false;

      if (insert) {
        setValue('serialized', insert);
        const mm = JSON.parse(insert);
        console.log('mm', mm);
        setInsertable(mm);
      }
      //
      setBody(d.data);
    }
  }, [dataTemplate]);

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  const [tokens, setToken] = useState<any>();
  const [insertable, setInsertable] = useState<any>();

  const insertToken = (token: any) => {
    const test = {
      type: 'holder',
      attrs: {
        name: token.name,
      },
    };
    setToken(test);
  };

  useEffect(() => {
    console.log('insertable', insertable);
  }, [insertable]);

  // useEffect(() => {
  //   setToken('')
  // }, []);

  const insertBlock = (b: any) => {
    console.log('inerting now...', b);
    // setInsertable(JSON.parse(b.serialised));
  };

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
            <Field
              name="title_template"
              label="Title Template"
              defaultValue=""
              register={register}
            />
            <Box sx={{ display: 'none' }}>
              <FieldText
                name="data"
                label="Text Template"
                defaultValue={''}
                register={register}
              />
              <FieldText
                name="serialized"
                label="Text Template"
                defaultValue={''}
                register={register}
              />
            </Box>
            <Box py={4}>
              <MarkdownEditor
              onUpdate={doUpdate}
              initialValue={EMPTY_MARKDOWN_NODE}
              editor="wysiwyg"
              value={body}
              token={tokens}
              editable={true}
              insertable={insertable}
              />
            </Box>
            <Label htmlFor="parent" mb={1}>
              Content Type
            </Label>
            <Select
              id="parent"
              name="parent"
              defaultValue="Parent ID"
              onChange={e => ctypeChange(e)}
              ref={register({ required: true })}>
              {ctypes &&
                ctypes.length > 0 &&
                ctypes.map((m: any) => (
                  <option value={m.id} key={m.id}>
                    {m.name}
                  </option>
                ))}
            </Select>
          </Box>
          <Box width={5 / 12} px={4} mr={3}>
            {varias && varias.fields && (
              <Box>
                <Text fontSize={1} mb={2}>
                  Tokens
                </Text>
                {varias.fields &&
                  varias.fields.map((k: FieldT) => (
                    <Tag key={k.id} onClick={() => insertToken(k)}>
                      {k.name}
                    </Tag>
                  ))}
              </Box>
            )}

            <Box>
              <Text fontSize={1} mb={2}>
                Blocks
              </Text>
              {blocks &&
                blocks.map((k: BlockTemplate) => (
                  <Tag key={k.id} onClick={() => insertBlock(k)}>
                    {k.title}
                  </Tag>
                ))}
            </Box>
          </Box>
          {errors.exampleRequired && <Text>This field is required</Text>}
        </Flex>
      </Box>

      {/* <WraftEditor/> */}
      <Button ml={2}>{cId ? 'Update' : 'Create'}</Button>
    </Box>
  );
};
export default Form;
