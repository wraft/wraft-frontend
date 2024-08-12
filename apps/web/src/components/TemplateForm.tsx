import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Button, Text, Spinner, Select } from 'theme-ui';
import { DotsThreeVertical, TextT, TrashSimple } from '@phosphor-icons/react';
import { Menu, MenuButton, MenuProvider, MenuItem } from '@ariakit/react';

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
// import { BracesVariable, ThreeDots } from './Icons';
import NavEdit from './NavEdit';
import { TimeAgo } from './Atoms';
import Modal from './Modal';
// import MenuItem from './MenuItem';

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
        variant="btnPrimaryInline"
        sx={{
          mt: 2,
          ml: 'auto',
          // border: 'solid 1px',
          // borderRadius: '9rem',
          color: 'text',
          borderColor: 'border',
          px: 2,
          py: 1,
          bg: 'neutral.100',
          pb: 0,
          height: '33px',
          // pb: 1,
          // mt: 2,
          // border: 0,
        }}>
        <DotsThreeVertical size={18} />
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
          width: '20ch',
        }}>
        <MenuItem onClick={() => deleteContent(id)}>
          <IconMenuItem text="Delete" icon={<TrashSimple />} />
        </MenuItem>
      </Menu>
    </MenuProvider>
  );
};

interface IconMenuItemProps {
  icon: any;
  text: string;
}
const IconMenuItem = ({ icon, text }: IconMenuItemProps) => {
  return (
    <Flex
      sx={{
        alignItem: 'center',
        cursor: 'pointer',
        gap: 1,
        ':hover': {
          bg: 'gray.300',
        },
        alignItems: 'center',
        px: 2,
        py: 2,
      }}>
      {icon}
      {text && <Text sx={{ fontWeight: 500, fontSize: 'sm' }}>{text}</Text>}
    </Flex>
  );
};

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
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

  const [pagetitle, setPageTitle] = useState<string>('');

  const [showSetup, setShowSetup] = useState<boolean>(true);

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
      setPageTitle(d.title);

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

  /**

  */

  const saveMe = () => {
    setShowSetup(!showSetup);

    const name = getValues();
    console.log('name=', name);
    setPageTitle(name?.title);

    if (name?.title_temple == '') {
      setValue('title_template', name?.title);
    }
  };

  return (
    <Box>
      <NavEdit
        navtitle={cId ? 'Edit ' + pagetitle : pagetitle}
        backLink="/templates"
        onToggleEdit={saveMe}
      />
      <Box as="form" onSubmit={handleSubmit(onSubmit)} py={0} mt={0}>
        <Box>
          <Flex>
            <Box
              // as="form"
              // onSubmit={handleSubmit(onSubmit)}
              sx={{
                minWidth: '70%',
                bg: 'neutral.100',
                maxWidth: '83ch',
                m: 0,
                pt: 3,
                input: {
                  bg: 'white',
                },
              }}>
              <Flex sx={{ px: 4 }}>
                <Box sx={{ flex: 1 }}>
                  <Field
                    name="title_template"
                    label=""
                    placeholder="Automatic Title, use @"
                    defaultValue=""
                    register={register}
                  />
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Flex sx={{ pr: 0, py: 0 }}>
                    {loading && <Spinner color="white" size={24} />}
                    {!loading && (
                      <Button variant="btnPrimary">
                        {cId ? 'Update' : 'Create'}
                      </Button>
                    )}
                  </Flex>
                </Box>
                {/*
                    <Field
                      name="title"
                      label="Name"
                      defaultValue=""
                      register={register}
                    />
                    */}
                {/* <Divider color="gray.2" sx={{ mt: 3, mb: 4 }} /> */}
              </Flex>
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

            <Modal isOpen={showSetup}>
              <Flex
                sx={{
                  p: 0,
                  minWidth: '50ch',
                  width: '100%',
                  // verticalAlign: 'top',
                  flexDirection: 'column',
                  // justifyContent: 'space-between',
                }}>
                <Box
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: 'solid 1px',
                    borderColor: 'gray.400',
                  }}>
                  <Text sx={{ fontWeight: 600 }}>Create Template</Text>
                </Box>
                <Box sx={{ py: 3, px: 4 }}>
                  <Field
                    name="title"
                    label="Name your Template"
                    placeholder="Title for your template"
                    defaultValue=""
                    register={register}
                  />
                  {varias && varias.fields && (
                    <Box sx={{ mb: 2, pt: 3 }}>
                      <Box sx={{ mb: 2, pb: 3 }}>
                        <Text
                          as="h4"
                          mb={2}
                          sx={{
                            mb: 2,
                            fontSize: 'sm',
                            fontWeight: 500,
                            letterSpacing: '-0.15px',
                          }}>
                          Variant
                        </Text>
                        <Select
                          id="parent"
                          // name="parent"
                          defaultValue="Parent ID"
                          disabled={false}
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
                    </Box>
                  )}
                </Box>
                <Flex
                  sx={{
                    py: 3,
                    px: 3,
                    gap: 2,
                    borderTop: 'solid 1px',
                    borderColor: 'gray.400',
                  }}>
                  <Button variant="btnPrimary" onClick={() => saveMe()}>
                    Save
                  </Button>
                  <Button variant="btnSecondary">Cancel</Button>
                </Flex>
              </Flex>
            </Modal>
            <Box
              px={4}
              variant="plateRightBar"
              sx={{
                bg: 'gray.100',
                width: '100%',
                borderLeft: 'solid 1px',
                borderColor: 'border',
                minHeight: '100vh',
              }}>
              {cId && dataTemplate && (
                <Flex sx={{ pt: 2, alignItems: 'center' }}>
                  <Box sx={{}}>
                    <Text sx={{ fontSize: 'sm', color: 'gray.1100' }}>
                      Updated{' '}
                    </Text>
                    <TimeAgo
                      time={dataTemplate?.data_template?.updated_at}
                      ago={true}
                    />
                  </Box>
                  <EditMenus id={cId} />
                </Flex>
              )}

              {varias && varias.fields && (
                <Box sx={{ mb: 2, pt: 3 }}>
                  <Box sx={{ mb: 3, pb: 3 }}>
                    <Text
                      as="h4"
                      // mb={2}
                      sx={{
                        mb: 0,
                        fontSize: 'sm',
                        fontWeight: 500,
                        letterSpacing: '-0.15px',
                      }}>
                      Fields
                    </Text>
                    <Text
                      as="p"
                      sx={{ fontSize: 'xs', color: 'gray.1000', mb: 3 }}>
                      Dynamic variables provided by Variants
                    </Text>
                    {varias.fields &&
                      varias.fields.map((k: FieldT) => (
                        <Flex
                          sx={{
                            p: 1,
                            fontSize: 'sm',
                            border: 'solid 1px',
                            borderBottom: 0,
                            borderColor: 'gray.500',
                            bg: 'gray.200',
                            px: 3,
                            ':last-child': {
                              borderBottom: 'solid 1px',
                              borderColor: 'gray.500',
                            },
                          }}
                          // as="p"
                          key={k.id}
                          onClick={() => insertBlock(k)}>
                          {k.name}
                          <Box sx={{ ml: 'auto', svg: { fill: 'blue.800' } }}>
                            <TextT />
                          </Box>
                        </Flex>
                      ))}
                  </Box>
                </Box>
              )}

              <Box sx={{ borderBottom: 0, mb: 3, pb: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Text
                    as="h4"
                    sx={{
                      mb: 0,
                      fontSize: 'sm',
                      fontWeight: 500,
                      letterSpacing: '-0.15px',
                    }}>
                    Blocks
                  </Text>
                  <Text as="p" sx={{ fontSize: 'xs', color: 'gray.1000' }}>
                    Blocks are reusable contents, click to insert
                  </Text>
                </Box>

                {blocks &&
                  blocks.map((k: BlockTemplate) => (
                    <Box
                      key={k.id}
                      onClick={() => insertBlock(k)}
                      sx={{
                        pl: 3,
                        borderBottom: 0,
                        border: 'solid 1px',
                        borderColor: 'gray.400',
                        bg: 'gray.200',
                        mb: 0,
                        pt: 2,
                        pb: 2,
                      }}>
                      <Text sx={{ fontSize: 'sm', mb: 0, fontWeight: 600 }}>
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
      </Box>
    </Box>
  );
};
export default Form;
