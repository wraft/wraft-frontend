import React, { useEffect, useState } from 'react';

import { Menu, MenuButton, MenuItem, MenuProvider } from '@ariakit/react';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text, Spinner, Select } from 'theme-ui';

import { putAPI, postAPI, fetchAPI, deleteAPI } from '../utils/models';
import {
  IContentType,
  ContentTypes,
  Field as FieldT,
  DataTemplate,
  DataTemplates,
} from '../utils/types';

import Editor from './common/Editor';
import Field from './Field';
import FieldText from './FieldText';
import { BracesVariable, ThreeDots } from './Icons';
import NavEdit from './NavEdit';

export interface BlockTemplate {
  id: string;
  title: string;
  body: string;
  serialized: string;
}

/**
 * Sidebar
 */

interface EditMenuProps {
  id: string;
}

const EditMenus = ({ id }: EditMenuProps) => {
  // const router = useRouter();
  /**
   * Delete content
   * @param id
   */
  const deleteContent = (id: string) => {
    deleteAPI(`data_templates/${id}`).then(() => {
      toast.success('Deleted the Template', {
        duration: 1000,
        position: 'top-right',
      });

      Router.push('/templates');
    });
  };
  return (
    <MenuProvider>
      <MenuButton
        as={Button}
        sx={{
          mt: 2,
          ml: 'auto',
          border: 'solid 1px',
          borderRadius: '9rem',
          color: 'text',
          borderColor: 'border',
          p: 0,
          bg: 'neutral.100',
          pb: 0,
          height: '33px',
          // pb: 1,
          // mt: 2,
          // border: 0,
        }}>
        <ThreeDots width={24} height={24} />
      </MenuButton>
      <Menu
        as={Box}
        aria-label="Manage Content"
        sx={{
          border: 'solid 1px',
          borderColor: 'border',
          borderRadius: 4,
          bg: 'neutral.100',
          color: 'text',
        }}>
        <MenuItem onClick={() => deleteContent(id)}>Delete</MenuItem>
      </Menu>
    </MenuProvider>
  );
};

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  const [varias, setVarias] = useState<IContentType>();
  const [dataTemplate, setDataTemplate] = useState<DataTemplates>();
  const [blocks, setBlocks] = useState<Array<BlockTemplate>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [insertable, setInsertable] = useState<any>();
  const [tokkans, setTokkans] = useState<any>('');
  const [insertions, setInsertions] = useState<any | null>(null);

  // determine edit state based on URL
  const router = useRouter();
  const cId: string = router.query.id as string;

  const onCreated = () => {
    Router.push('/templates');
  };

  /**
   * Cleanup Inserts
   */
  const onceInserted = () => {
    setInsertions(null);
  };

  /**
   * Form Submit
   * @param data
   */
  const onSubmit = (data: any) => {
    setLoading(true);

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
      putAPI(`data_templates/${cId}`, formValues)
        .then(() => {
          onCreated();
          toast.success('Updated Successfully', {
            duration: 1000,
            position: 'top-right',
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to update!', {
            duration: 1000,
            position: 'top-right',
          });
        });
    } else {
      postAPI(`content_types/${data.parent}/data_templates`, formValues)
        .then(() => {
          onCreated();
          toast.success('Created Successfully', {
            duration: 1000,
            position: 'top-right',
          });
          setLoading(false);
        })
        .catch(() => {
          toast.error('Failed to Create!', {
            duration: 1000,
            position: 'top-right',
          });
        });

      setLoading(false);
    }
  };

  const loadTypesSuccess = (data: any) => {
    const res: IContentType[] = data.content_types;
    setContentTypes(res);
  };

  const loadTypes = () => {
    fetchAPI('content_types').then((data: any) => {
      loadTypesSuccess(data);
    });
  };

  const loadContentTypeSuccess = (data: any) => {
    const formed: ContentTypes = data;
    setVarias(formed.content_type);
    dataFiller(formed.content_type.fields || {});
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadContentType = (id: string) => {
    fetchAPI(`content_types/${id}`).then((data: any) => {
      loadContentTypeSuccess(data);
    });
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadBlocks = () => {
    fetchAPI(`block_templates`).then((data: any) => {
      loadBlocksSuccess(data);
    });
  };

  const loadBlocksSuccess = (data: any) => {
    const allBlocks: BlockTemplate[] = data.block_templates;
    setBlocks(allBlocks);
  };

  /**
   * Load Content Type Details
   * @param id
   */
  const loadTemplate = (id: string) => {
    setLoading(true);
    fetchAPI(`data_templates/${id}`).then((data: any) => {
      loadTemplateSuccess(data);
    });
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
        // setToken(mm);
      }
    }
    setDataTemplate(data);
  };

  const dataFiller = (entries: any) => {
    const keys = Object.entries(entries);
    const k: any = keys;
    return k;
  };

  /**
   * Document variables
   */
  useEffect(() => {
    if (varias?.fields) {
      const { fields } = varias;

      if (fields.length > 0) {
        const results = fields.map((sr: any) => {
          return {
            id: `${sr.id}`,
            label: `${sr.name}`,
            name: `${sr.name}`,
          };
        });
        setTokkans(results);
      }
    }
  }, [varias]);

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
   * When Editor is updated, sync values to
   * the hidden fields
   * @param data
   */
  const doUpdate = (data: any) => {
    if (data.md) {
      setValue('data', data.md);
    }
    if (data.json) {
      const body = data.json;
      setValue('serialized', JSON.stringify(body));
    }
  };

  useEffect(() => {
    loadTypes();
    loadBlocks();
  }, []);

  useEffect(() => {
    // find the first element
    if (ctypes && ctypes[0] && ctypes[0].id) {
      loadContentType(ctypes[0].id);
    }
  }, [ctypes]);

  useEffect(() => {
    if (cId) {
      loadTemplate(cId);
    }
  }, [cId]);

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
      const insertReady = (d && d.serialized && d.serialized.data) || false;

      if (insertReady) {
        setValue('serialized', insertReady);
        const mm = JSON.parse(insertReady);
        setInsertable(mm);
      }
    }
  }, [dataTemplate]);

  /**
   * Insert a block at pointer
   * @param block
   */
  const insertBlock = (block: any) => {
    const n = JSON.parse(block.serialized);
    if (n && n.content) {
      setInsertions(n);
    }
  };

  return (
    <Box>
      <NavEdit
        navtitle={cId ? 'Edit Template' : 'New Template'}
        backLink="/templates"
      />
      <Box as="form" onSubmit={handleSubmit(onSubmit)} py={0} mt={0}>
        <Box>
          <Flex>
            {insertable && <Box />}
            <Box
              // as="form"
              // onSubmit={handleSubmit(onSubmit)}
              sx={{
                minWidth: '70%',
                bg: 'neutral.100',
                maxWidth: '83ch',
                m: 0,
                pt: 4,
                input: {
                  bg: 'white',
                },
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
              <Box
                py={4}
                sx={{
                  px: 4,
                  '.remirror-editor-wrapper .remirror-theme .ProseMirror': {
                    py: '5rem !important',
                  },
                }}>
                <Editor
                  editable
                  defaultValue={insertable}
                  onUpdate={doUpdate}
                  tokens={tokkans}
                  onceInserted={onceInserted}
                  insertable={insertions}
                />
              </Box>
              {/* <Counter /> */}
            </Box>
            <Box
              px={4}
              variant="plateRightBar"
              sx={{
                bg: 'neutral.100',
                width: '100%',
                borderLeft: 'solid 1px',
                borderColor: 'border',
                minHeight: '100vh',
              }}>
              <Box>{cId && <EditMenus id={cId} />}</Box>
              {varias && varias.fields && (
                <Box sx={{ mb: 3, pt: 3 }}>
                  <Box sx={{ borderBottom: 'solid 1px #ddd', mb: 3, pb: 3 }}>
                    <Text as="h4" mb={2} sx={{ mb: 2, fontSize: 2 }}>
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
                    <Text as="h4" mb={2} sx={{ mb: 2, fontSize: 2 }}>
                      Variables
                    </Text>
                    {varias.fields &&
                      varias.fields.map((k: FieldT) => (
                        <Flex
                          sx={{
                            p: 1,
                            fontSize: 2,
                            border: 'solid 1px',
                            borderBottom: 0,
                            borderColor: 'teal.200',
                            bg: 'teal.100',
                            px: 3,
                            ':last-child': {
                              borderBottom: 'solid 1px',
                              borderColor: 'teal.200',
                            },
                          }}
                          // as="p"
                          key={k.id}
                          onClick={() => insertBlock(k)}>
                          {k.name}
                          <Box sx={{ ml: 'auto', svg: { fill: 'blue.800' } }}>
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
                        borderColor: 'border',
                        bg: 'neutral.200',
                        mb: 1,
                        pt: 2,
                        pb: 3,
                      }}>
                      <Text sx={{ fontSize: 2, mb: 0, fontWeight: 600 }}>
                        {k.title}
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
