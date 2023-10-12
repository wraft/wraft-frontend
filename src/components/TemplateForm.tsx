import React, { useEffect, useState } from 'react';
import { Box, Flex, Button, Text, Divider, Spinner } from 'theme-ui';
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

import { Select } from 'theme-ui';

import { useRouter } from 'next/router';
import { useStoreState } from 'easy-peasy';

import { useToasts } from 'react-toast-notifications';

import { BracesVariable } from './Icons';

import MarkdownEditor from './WraftEditor';

import {
  loadEntity,
  loadEntityDetail,
  createEntity,
  updateEntity,
} from '../utils/models';

import NavEdit from './NavEdit';

export interface BlockTemplate {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const token = useStoreState((state) => state.auth.token);
  const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  const [varias, setVarias] = useState<IContentType>();
  const [dataTemplate, setDataTemplate] = useState<DataTemplates>();
  const [blocks, setBlocks] = useState<Array<BlockTemplate>>([]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [editorReady, setEditorReady] = useState<boolean>(false);
  // const [keys, setKeys] = useState<Array<string>>();

  const [cleanInsert, setCleanInsert] = useState<boolean>(false);

  const { addToast } = useToasts();

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  const onCreated = () => {
    console.log('[onCreated]');
  };

  /**
   * Form Submit
   * @param data
   */
  const onSubmit = (data: any) => {
    console.log('data', data);
    setLoading(true);

    const formValues = {
      title_template: data.title_template,
      title: data.title,
      data: data.data,
      serialized: {
        data: data.serialized,
      },
    };

    console.log('Create/Update Template', formValues);

    // if edit is live
    if (cId) {
      updateEntity(`data_templates/${cId}`, formValues, token, onCreated);
      addToast('Updated Successfully', { appearance: 'success' });
      setLoading(false);
    } else {
      createEntity(
        formValues,
        `content_types/${data.parent}/data_templates`,
        token,
        onCreated,
      );
      addToast('Created Successfully', { appearance: 'success' });
      setLoading(false);
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
    console.log('Loaded Content Type: 🎃', formed);
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
    setLoading(true);
    loadEntityDetail(token, 'data_templates', id, loadTemplateSuccess);
  };

  const loadTemplateSuccess = (data: DataTemplates) => {
    setLoading(false);
    const insert =
      (data.data_template &&
        data.data_template.serialized &&
        data.data_template.serialized.data) ||
      false;

    if (insert) {
      const mm = JSON.parse(insert);
      if (mm) {
        console.log('has serials', mm);
        setCleanInsert(false);
        setToken(mm);
      }
    }
    setDataTemplate(data);
    setCleanInsert(true);
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
    console.log('[When Editor is updated]', data);

    if (data.md) {
      setValue('body', data.md);
    }

    // body

    if (data.body) {
      const body = data.body;
      setValue('serialized', JSON.stringify(body));
      setValue('data', JSON.stringify(body));
    }

    // if (data.body) {
    //   setValue('serialized', data.body);
    // }

    if (data.serialized) {
      setValue('serialized', data.serialized);
    }
    // // console.log('data', data);
    // // setValue('body', data);
    // if (data.content) {
    //   console.log('[When Editor is content]', data)
    //   setValue('data', data.content);
    // }
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
      const insert = (d && d.serialized && d.serialized.data) || false;

      if (insert) {
        setValue('serialized', insert);
        const mm = JSON.parse(insert);
        console.log('mm', mm);
        setInsertable(mm);
      }
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
    setEditorReady(true);
  }, []);

  useEffect(() => {
    console.log('body', body);
  }, [body]);

  const insertBlock = (b: any) => {
    const n = JSON.parse(b.serialized);
    if (n && n.content) {
      setToken(n);
    }
  };

  return (
    <Box>
      <NavEdit />
      <Box as="form" onSubmit={handleSubmit(onSubmit)} py={0} mt={0}>
        <Box>
          <Flex>
            {insertable && <Box />}
            <Box
              // as="form"
              // onSubmit={handleSubmit(onSubmit)}
              sx={{
                minWidth: '70%',
                bg: 'neutral.0',
                maxWidth: '83ch',
                m: 0,
                pt: 4,
              }}>
              <Box sx={{ px: 4 }}>
                <Field
                  name="title"
                  label="Name"
                  defaultValue=""
                  register={register}
                />
                {/* <Divider color="gray.2" sx={{ mt: 3, mb: 4 }} /> */}
                <Field
                  name="title_template"
                  label="Title Template"
                  defaultValue=""
                  register={register}
                />
              </Box>
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
                {editorReady && (
                  <MarkdownEditor
                    onUpdate={doUpdate}
                    starter={tokens}
                    cleanInsert={cleanInsert}
                    token={tokens}
                    editable={true}
                    variables={varias}
                    searchables={varias}
                    showToolbar={true}
                  />
                )}
              </Box>
              {/* <Counter /> */}
            </Box>
            <Box
              px={4}
              variant="plateRightBar"
              sx={{
                bg: 'neutral.0',
                width: '100%',
                borderLeft: 'solid 1px',
                borderColor: 'gray.2',
              }}>
              {varias && varias.fields && (
                <Box sx={{ mb: 3, pt: 3 }}>
                  <Box sx={{ borderBottom: 'solid 1px #ddd', mb: 3, pb: 3 }}>
                    <Text as="h4" mb={2} sx={{ mb: 1 }}>
                      Content Type
                    </Text>
                    <Select
                      id="parent"
                      // name="parent"
                      defaultValue="Parent ID"
                      // ref={register({ required: true })}
                      {...register('parent', { required: true })}
                      onChange={(e) => ctypeChange(e)}>
                      {ctypes &&
                        ctypes.length > 0 &&
                        ctypes.map((m: any) => (
                          <option value={m.id} key={m.id}>
                            {m.name}
                          </option>
                        ))}
                    </Select>
                  </Box>

                  <Box sx={{ borderBottom: 'solid 1px #ddd', mb: 3, pb: 3 }}>
                    <Text as="h4" mb={2} sx={{ mb: 3 }}>
                      Variables
                    </Text>
                    {varias.fields &&
                      varias.fields.map((k: FieldT) => (
                        <Flex
                          sx={{
                            p: 1,
                            border: 'solid 1px',
                            borderBottom: 0,
                            borderColor: 'gray.2',
                            bg: 'teal.8',
                            px: 3,
                            ':last-child': {
                              borderBottom: 'solid 1px',
                              borderColor: 'gray.2',
                            },
                          }}
                          as="p"
                          key={k.id}
                          onClick={() => insertToken(k)}>
                          {k.name}
                          <Box sx={{ ml: 'auto', svg: { fill: 'blue.7' } }}>
                            <BracesVariable width={16} />
                          </Box>
                        </Flex>
                      ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ borderBottom: 'solid 1px red', mb: 3, pb: 2 }}>
                <Text as="h4" mb={2} sx={{ mb: 3 }}>
                  Blocks
                </Text>
                {blocks &&
                  blocks.map((k: BlockTemplate) => (
                    <Box
                      key={k.id}
                      onClick={() => insertBlock(k)}
                      sx={{
                        pl: 3,
                        border: 'solid 0.5px',
                        borderColor: 'gray.3',
                        bg: 'gray.1',
                        mb: 1,
                        pt: 2,
                        pb: 3,
                      }}>
                      <Text sx={{ fontSize: 1, mb: 0, fontWeight: 600 }}>
                        {k.title}
                      </Text>
                      <Text as="p" sx={{ fontSize: 0, fontWeight: 200, pt: 0 }}>
                        Template Bio
                      </Text>
                    </Box>
                  ))}
              </Box>
            </Box>
            {errors.exampleRequired && <Text>This field is required</Text>}
          </Flex>
        </Box>

        {/* <WraftEditor/> */}
        <Box>
          <Flex sx={{ px: 4, py: 1 }}>
            {loading && <Spinner color="white" size={24} />}
            {!loading && <Button>{cId ? 'Update' : 'Create'}</Button>}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
export default Form;
