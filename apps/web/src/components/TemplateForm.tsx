import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Box, Flex, Text } from 'theme-ui';
import { DotsThreeVertical, TextT, TrashSimple } from '@phosphor-icons/react';
import { Button, DropdownMenu } from '@wraft/ui';

import { TimeAgo } from 'common/Atoms';
import Modal from 'common/Modal';
import Field from 'common/Field';
import SelectCombobox from 'common/SelectCombobox';
import { putAPI, postAPI, fetchAPI, deleteAPI } from 'utils/models';
import {
  IContentType,
  ContentTypes,
  Field as FieldT,
  DataTemplate,
  DataTemplates,
} from 'utils/types';

import Editor from './common/Editor';
import FieldText from './FieldText';
import NavEdit from './NavEdit';
import MentionField from './MentionsField';

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
  const deleteContent = (contentId: string) => {
    deleteAPI(`data_templates/${contentId}`).then(() => {
      toast.success('Deleted the Template', {
        duration: 1000,
        position: 'top-right',
      });

      Router.push('/templates');
    });
  };
  return (
    <DropdownMenu.Provider>
      <DropdownMenu.Trigger
        as={Button}
        variant="btnSecondaryInline"
        sx={{
          color: 'text',
          px: 2,
          py: 1,
        }}>
        <DotsThreeVertical size={18} weight="bold" />
      </DropdownMenu.Trigger>

      <DropdownMenu aria-label="dropdown role">
        <DropdownMenu.Item onClick={() => deleteContent(id)}>
          <IconMenuItem text="Delete" icon={<TrashSimple />} />
        </DropdownMenu.Item>
      </DropdownMenu>
    </DropdownMenu.Provider>
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
  const [blocks, setBlocks] = useState<Array<BlockTemplate>>([]);
  const [ctypes, setContentTypes] = useState<Array<IContentType>>([]);
  const [dataTemplate, setDataTemplate] = useState<DataTemplates>();
  const [fields, setFields] = useState<any>([]);
  const [insertable, setInsertable] = useState<any>();
  const [insertions, setInsertions] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagetitle, setPageTitle] = useState<string>('');
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [tokkans, setTokkans] = useState<any>('');
  const [variant, setVariant] = useState<IContentType>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    control,
  } = useForm();
  const router = useRouter();
  const cId: string = router.query.id as string;

  useEffect(() => {
    if (cId && dataTemplate && dataTemplate.data_template) {
      const d: DataTemplate = dataTemplate.data_template;
      setValue('title', d.title);
      setValue('title_template', d.title_template);
      setValue('parent', dataTemplate.content_type.id, {
        shouldValidate: true,
      });
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

  useEffect(() => {
    loadTypes();
    loadBlocks();

    if (!cId) {
      setShowSetup(true);
    }
  }, []);

  useEffect(() => {
    // find the first element
    if (!cId && ctypes && ctypes[0] && ctypes[0].id) {
      loadContentType(ctypes[0].id);
    }
  }, [ctypes]);

  useEffect(() => {
    if (cId) {
      loadTemplate(cId);
    }
  }, [cId]);

  useEffect(() => {
    if (variant?.fields) {
      const { fields: variasFields } = variant;

      if (variasFields.length > 0) {
        const results = variasFields.map((sr: any) => {
          return {
            id: `${sr.id}`,
            label: `${sr.name}`,
            name: `${sr.name}`,
          };
        });
        setTokkans(results);
      }
    }
  }, [variant]);

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
          setLoading(true);
          toast.error('Failed to update!', {
            duration: 1000,
            position: 'top-right',
          });
        });
    } else {
      postAPI(`content_types/${data.parent}/data_templates`, formValues)
        .then((content: any) => {
          Router.replace(`/templates/edit/${content.id}`);
          // onCreated();
          toast.success('Created Successfully', {
            duration: 3000,
            position: 'top-right',
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(
            (error && JSON.stringify(error)) ||
              'Something went wrong please try again later',
            {
              duration: 3000,
              position: 'top-right',
            },
          );
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

  /**
   * Load Content Type Details
   * @param id
   */
  const loadContentType = (id: string) => {
    fetchAPI(`content_types/${id}`).then((data: any) => {
      const formed: ContentTypes = data;
      setVariant(formed.content_type);

      if (formed?.content_type?.fields) {
        const fieldOption = formed.content_type.fields.map(({ name }) => ({
          value: `[${name}]`,
          label: name,
        }));
        setFields(fieldOption);
      }
      dataFiller(formed.content_type.fields || {});
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
   * When Content Type is Changed
   * - Load Available fields here.
   * @param id
   */

  const ctypeChange = (ctypeId: string) => {
    const safeSearchTypeValue: string = ctypeId;
    setValue('parent', ctypeId);
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

  const saveMe = () => {
    setShowSetup(!showSetup);

    const name = getValues();
    setPageTitle(name?.title);

    if (name?.title_template === '') {
      setValue('title_template', name?.title);
    }
  };

  const onCancelPopup = () => {
    if (!cId) {
      onCreated();
      return;
    }

    setShowSetup(!showSetup);
  };

  return (
    <Box sx={{ height: 'calc(100vh)', overflow: 'hidden' }}>
      <NavEdit
        navtitle={cId ? 'Edit ' + pagetitle : pagetitle}
        backLink="/templates"
        onToggleEdit={saveMe}
      />
      <Flex
        // as="form"
        sx={{ alignItems: 'flex-start' }}
        // onSubmit={handleSubmit(onSubmit)}
        py={0}
        mt={0}>
        <Box
          as="form"
          onSubmit={handleSubmit(onSubmit)}
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
          <Flex sx={{ px: 4, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Controller
                control={control}
                name="title_template"
                render={({ field: { onChange, value, name } }) => (
                  <MentionField
                    onChange={onChange}
                    name={name}
                    defaultValue={value}
                    options={fields}
                    placeholder="Automatic Title, use @ ds"
                  />
                )}
              />
            </Box>

            <Box sx={{ ml: 2 }}>
              <Button variant="primary" loading={loading} type="submit">
                {cId ? 'Update' : 'Create'}
              </Button>
            </Box>
          </Flex>
          <Box sx={{ display: 'none' }}>
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
              '.remirror-editor-wrapper': {
                maxHeight: 'calc(100vh - 200px)',
                display: 'block',
                overflowY: 'scroll',
              },
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
              flexDirection: 'column',
            }}>
            <Box
              sx={{
                py: 2,
                px: 3,
                borderBottom: 'solid 1px',
                borderColor: 'gray.400',
              }}>
              <Text sx={{ fontWeight: 600 }}>
                {cId ? `EditTemplate` : 'Create Template'}
              </Text>
            </Box>
            <Box sx={{ py: 3, px: 4 }}>
              <Field
                name="title"
                label="Name your Template"
                placeholder="Title for your template"
                defaultValue=""
                register={register}
              />
              {errors.title && errors.title.message && (
                <Text variant="error">{errors.title.message as string}</Text>
              )}

              {variant && variant.fields && !cId && (
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
                    <SelectCombobox
                      id="parent"
                      disabled={false}
                      {...register('parent')}
                      onChange={ctypeChange}
                      options={ctypes}
                    />
                    {errors.parent && errors.parent.message && (
                      <Text variant="error">
                        {errors.parent.message as string}
                      </Text>
                    )}
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
              <Button variant="primary" onClick={handleSubmit(saveMe)}>
                Save
              </Button>
              <Button variant="secondary" onClick={() => onCancelPopup()}>
                Cancel
              </Button>
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
              <Box sx={{ ml: 'auto' }}>
                <EditMenus id={cId} />
              </Box>
            </Flex>
          )}

          {variant && variant.fields && (
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
                <Text as="p" sx={{ fontSize: 'xs', color: 'gray.1000', mb: 3 }}>
                  Dynamic variables provided by Variants
                </Text>
                {variant.fields &&
                  variant.fields.map((k: FieldT) => (
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

        {/* <WraftEditor/> */}
      </Flex>
    </Box>
  );
};
export default Form;
